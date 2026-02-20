import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json({ error: '请提供图片' }, { status: 400 });
    }

    const zai = await ZAI.create();

    // 使用视觉模型验证图片是否为宠物
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `请仔细分析这张图片，判断图片中是否有宠物（猫、狗、鸟、兔子、仓鼠、鱼、蜥蜴、乌龟等常见宠物）。

请按以下格式回复（必须是有效的JSON）：
{
  "isPet": true/false,
  "petType": "宠物类型（如：猫、狗、鸟等），如果没有宠物则为空",
  "confidence": 0-100的置信度数字,
  "reason": "简短的判断理由"
}

只回复JSON，不要有其他内容。`
            },
            {
              type: 'image_url',
              image_url: { url: image }
            }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    });

    const content = response.choices[0]?.message?.content;
    console.log('[Pet Verify] AI Response:', content);

    // 尝试解析JSON响应
    try {
      // 提取JSON部分（可能被markdown包裹）
      let jsonStr = content || '';
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      const result = JSON.parse(jsonStr);
      
      return NextResponse.json({
        success: true,
        isPet: result.isPet === true || result.isPet === 'true',
        petType: result.petType || '',
        confidence: result.confidence || 0,
        reason: result.reason || ''
      });
    } catch (parseError) {
      console.error('[Pet Verify] Parse error:', parseError);
      
      // 如果无法解析JSON，尝试从文本中判断
      const lowerContent = (content || '').toLowerCase();
      const isPet = lowerContent.includes('"ispet": true') || 
                    lowerContent.includes('"ispet":true') ||
                    (lowerContent.includes('宠物') && !lowerContent.includes('没有宠物'));
      
      return NextResponse.json({
        success: true,
        isPet,
        petType: '',
        confidence: isPet ? 70 : 30,
        reason: 'AI分析完成'
      });
    }
  } catch (error: any) {
    console.error('[Pet Verify] Error:', error);
    return NextResponse.json({
      success: false,
      error: '验证失败，请稍后重试',
      details: error?.message
    }, { status: 500 });
  }
}
