// GeminiService.kt
package com.ncertaihub.app.api

import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content

class GeminiService(apiKey: String) {
    private val model = GenerativeModel(
        modelName = "gemini-3-flash-preview",
        apiKey = apiKey
    )

    suspend fun generateResponse(prompt: String): String {
        val response = model.generateContent(content {
            text("You are an NCERT teacher. Explain simply in Hindi with examples: $prompt")
        })
        return response.text ?: "No response"
    }
}
