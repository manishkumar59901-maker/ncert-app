// MainActivity.kt
package com.ncertaihub.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.padding
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.*
import com.ncertaihub.app.ui.theme.AppTheme
import com.ncertaihub.app.ui.screens.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AppTheme {
                val navController = rememberNavController()
                Scaffold(
                    bottomBar = { BottomNavigationBar(navController) }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "dashboard",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable("dashboard") { DashboardScreen(navController) }
                        composable("study") { StudyScreen(navController) }
                        composable("ai_doubt") { DoubtSolverScreen(navController) }
                        composable("timer") { TimerScreen(navController) }
                        composable("quiz/{chapterId}") { backStackEntry ->
                            QuizScreen(backStackEntry.arguments?.getString("chapterId"))
                        }
                    }
                }
            }
        }
    }
}
