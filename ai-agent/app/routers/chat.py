import json
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from app.models.schemas import ChatRequest, Message
from app.services import gemini
from typing import List, Dict, Any

router = APIRouter()

def to_gemini_messages(messages: List[Message]) -> List[Dict[str, Any]]:
    return [{"role": m.role, "parts": [{"text": m.content}]} for m in messages]

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    gemini_messages = to_gemini_messages(request.messages)
    
    if not request.stream:
        content = gemini.chat(gemini_messages)
        return {"content": content}
    
    def event_generator():
        for chunk in gemini.chat_stream(gemini_messages):
            yield {"data": json.dumps({"content": chunk})}
        yield {"data": "[DONE]"}
    
    return EventSourceResponse(event_generator())
