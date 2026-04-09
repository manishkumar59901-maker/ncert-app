// Repository.kt
package com.ncertaihub.app.data

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.auth.FirebaseAuth
import com.ncertaihub.app.api.GeminiService
import kotlinx.coroutines.tasks.await

class Repository(
    private val db: FirebaseFirestore,
    private val auth: FirebaseAuth,
    private val geminiService: GeminiService
) {
    suspend fun getAiSolution(question: String, imageUri: String?): String {
        // Logic to handle image OCR via ML Kit then send to Gemini
        return geminiService.generateResponse(question)
    }

    suspend fun saveDoubtToHistory(question: String, answer: String) {
        val userId = auth.currentUser?.uid ?: return
        val doubt = hashMapOf(
            "question" to question,
            "answer" to answer,
            "timestamp" to System.currentTimeMillis()
        )
        db.collection("users").document(userId)
            .collection("doubts").add(doubt).await()
    }

    suspend fun getChapters(subject: String) = 
        db.collection("chapters")
            .whereEqualTo("subject", subject)
            .get().await()
}
