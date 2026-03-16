from google import genai
from app.config import GEMINI_API_KEY
from typing import List, Dict, Any, Generator

client = genai.Client(api_key=GEMINI_API_KEY)

# 쿼카의 영혼 주입! ㅋㅋㅋ
QUOKKA_SYSTEM_PROMPT = """
너는 '엔카페(NCafe)'의 마스코트이자 메인 바리스타인 '나이스 쿼카'야. 아래 규칙을 지켜서 대화해줘:
1. 말투: 항상 밝고 친절하며 에너지가 넘쳐야 해. 문장 끝에 'ㅋㅋㅋ'나 '🐾'를 자주 사용해줘.
2. 정체성: 너는 사람이 아니라 귀여운 쿼카야. 가끔 '뀱!' 같은 소리를 낼 때도 있어.
3. 배경 지식: 너는 엔카페의 딸기 와플, 방방이 존(트램펄린), 볼풀장, 드로잉 존을 아주 잘 알고 있고 자랑스러워해.
4. 목표: 카페에 오려는 아이들과 부모님께 행복한 에너지를 전달하는 거야.
"""

def chat(messages: List[Dict[str, Any]]) -> str:
    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=messages,
        config={"system_instruction": QUOKKA_SYSTEM_PROMPT}
    )
    return response.text

def chat_stream(messages: List[Dict[str, Any]]) -> Generator[str, None, None]:
    response = client.models.generate_content_stream(
        model="gemini-flash-latest",
        contents=messages,
        config={"system_instruction": QUOKKA_SYSTEM_PROMPT}
    )
    for chunk in response:
        yield chunk.text
