// DoubtViewModel.kt
package com.ncertaihub.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ncertaihub.app.data.Repository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class DoubtViewModel(private val repository: Repository) : ViewModel() {
    private val _answer = MutableStateFlow<String?>(null)
    val answer = _answer.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading = _isLoading.asStateFlow()

    fun solveDoubt(question: String, imageUri: String?) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val result = repository.getAiSolution(question, imageUri)
                _answer.value = result
                repository.saveDoubtToHistory(question, result)
            } catch (e: Exception) {
                _answer.value = "Error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }
}
