import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const skinAnalysisPrompt = `
Ты профессиональный консультант по базовому уходу за кожей. Анализируй только то, что можно визуально оценить по фотографии лица. Никогда не диагностируй кожные заболевания и не назначай лекарства.

Верни ответ СТРОГО в JSON без markdown и без любого дополнительного текста:
{
  "score": number,
  "visibleInImage": string[],
  "providedByUser": string[],
  "recommendations": [{"title": string, "text": string}],
  "products": [{"id": string, "reason": string}],
  "confidence": {"level": "High" | "Medium" | "Low", "explanation": string},
  "summary": string
}

## Оценка состояния кожи (score)
Целое число 0–100 по стобалльной шкале:
- 85–100: визуально ровная, спокойная кожа, минимум видимых неровностей
- 65–84: хорошее состояние с небольшими видимыми особенностями
- 45–64: умеренные видимые особенности, требующие внимания
- 0–44: выраженные видимые особенности
Снижай оценку при плохом качестве изображения.

## Видимые параметры (visibleInImage)
Перечисли 3–6 пунктов: что именно видно на фото — тон, текстура, блеск, поры, неоднородность, признаки обезвоженности и т.д.

## Что предоставил пользователь (providedByUser)
Если жалоб нет — одна строка: "Пользователь не предоставил дополнительных жалоб."
Если пользовательские жалобы не видны на фото — используй: "Пользователь сообщил об этой особенности, но её нельзя надёжно оценить по текущему изображению."

## Рекомендации (recommendations)
4–5 пунктов. Каждая рекомендация — одно предложение с конкретным советом по уходу.

## Подбор средств (products)
Выбери 4–6 средств из переданного каталога. Обязательно включи по одному из каждой категории:
- Cleanser
- Moisturizer
- SPF
- Active Treatment

Можно добавить второе средство из любой категории, если это обосновано.
Смешивай Basic и Premium в зависимости от видимого состояния кожи.
Для каждого средства верни id из каталога и reason — одно предложение объяснения выбора.

## Уровень уверенности (confidence)
- High: хорошее освещение, лицо прямо, высокое разрешение, лицо полностью видно
- Medium: приемлемые условия съёмки, небольшие ограничения
- Low: плохое освещение, поворот лица, низкое разрешение, частичная видимость
Кратко объясни причину уровня уверенности.

## Итоговое резюме (summary)
2–3 предложения: текущее состояние кожи, главные сильные стороны, наиболее перспективные улучшения.

## ОГРАНИЧЕНИЯ
- Никогда не диагностируй: acne vulgaris, rosacea, eczema, dermatitis, psoriasis, skin cancer, infections.
- Никогда не назначай лекарства.
- Не заявляй абсолютную уверенность при неопределённости.
- При плохом качестве изображения явно укажи, что надёжность оценки снижена.
- Приоритет — фотография, а не предположения.
- Тон: профессиональный, объективный, доказательный.

ЯЗЫК ОТВЕТА: РУССКИЙ
`

function skinAnalysisApiPlugin(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), '')
  const anthropicBaseUrl = env.ANTHROPIC_BASE_URL || 'https://api.oneprovider.dev'
  const anthropicApiKey = env.ANTHROPIC_API_KEY
  const anthropicModel = env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest'

  const handler = async (req: any, res: any) => {
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.end('Method not allowed')
      return
    }

    if (!anthropicApiKey) {
      res.statusCode = 503
      res.end('ANTHROPIC_API_KEY is not configured')
      return
    }

    try {
      const body = await readJsonBody(req)
      const image = typeof body.image === 'string' ? body.image : ''
      const products = Array.isArray(body.products) ? body.products : []
      const mediaType = image.startsWith('data:image/png') ? 'image/png' : 'image/jpeg'
      const imageData = image.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '')

      if (!imageData) {
        res.statusCode = 400
        res.end('Image is required')
        return
      }

      const upstream = await fetch(`${anthropicBaseUrl.replace(/\/$/, '')}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: anthropicModel,
          max_tokens: 3000,
          temperature: 0.2,
          system: skinAnalysisPrompt,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: mediaType,
                    data: imageData,
                  },
                },
                {
                  type: 'text',
                  text: `Каталог средств для выбора:\n${JSON.stringify(products, null, 2)}`,
                },
              ],
            },
          ],
        }),
      })

      if (!upstream.ok) {
        res.statusCode = upstream.status
        res.end(await upstream.text())
        return
      }

      const payload = await upstream.json()
      const text = extractAnthropicText(payload)
      const json = parseJsonObject(text)

      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(json))
    } catch (error) {
      res.statusCode = 500
      res.end(error instanceof Error ? error.message : 'Skin analysis failed')
    }
  }

  return {
    name: 'skincode-skin-analysis-api',
    configureServer(server) {
      server.middlewares.use('/api/skin-analysis', handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/skin-analysis', handler)
    },
  }
}

function readJsonBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk: unknown) => {
      raw += String(chunk)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'))
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function extractAnthropicText(payload: any) {
  const blocks = Array.isArray(payload?.content) ? payload.content : []
  return blocks
    .filter((block: any) => block?.type === 'text' && typeof block.text === 'string')
    .map((block: any) => block.text)
    .join('\n')
}

function parseJsonObject(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Model did not return JSON')
    return JSON.parse(match[0])
  }
}

export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), skinAnalysisApiPlugin(mode)],
  server: {
    host: true,
    port: 5173,
  },
}))
