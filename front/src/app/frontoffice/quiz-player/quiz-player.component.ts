import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService, Quiz, Question } from '../../services/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quiz-player',
  templateUrl: './quiz-player.component.html',
  styleUrls: ['./quiz-player.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class QuizPlayerComponent implements OnInit {
  
  quiz: Quiz | null = null;
  currentQuestionIndex = 0;
  selectedAnswer: string = '';
  score = 0;
  isQuizCompleted = false;
  userAnswers: { questionId: number, answer: string, isCorrect: boolean }[] = [];
  isLoading = true;
  maxScore = 0;

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      this.loadQuiz(parseInt(quizId));
    }
  }

  loadQuiz(id: number): void {
    this.quizService.getQuizById(id).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        this.calculateMaxScore();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du quiz:', error);
        this.isLoading = false;
      }
    });
  }

  calculateMaxScore(): void {
    if (!this.quiz || !this.quiz.questions) {
      this.maxScore = 0;
      return;
    }
    this.maxScore = this.quiz.questions.reduce((sum, q) => sum + (q.score || 0), 0);
  }

  get correctAnswersCount(): number {
    return this.userAnswers.filter(a => a.isCorrect).length;
  }

  get incorrectAnswersCount(): number {
    return this.userAnswers.filter(a => !a.isCorrect).length;
  }

  get successRate(): number {
    if (this.userAnswers.length === 0) return 0;
    return Math.round((this.correctAnswersCount / this.userAnswers.length) * 100);
  }

  get currentQuestion(): Question | null {
    if (!this.quiz || !this.quiz.questions) return null;
    return this.quiz.questions[this.currentQuestionIndex] || null;
  }

  get progress(): number {
    if (!this.quiz || !this.quiz.questions) return 0;
    return Math.round(((this.currentQuestionIndex + 1) / this.quiz.questions.length) * 100);
  }

  selectAnswer(answer: string): void {
    this.selectedAnswer = answer;
  }

  submitAnswer(): void {
    if (!this.selectedAnswer || !this.currentQuestion) return;

    const isCorrect = this.selectedAnswer === this.currentQuestion.correctAnswer;
    
    if (isCorrect) {
      this.score += this.currentQuestion.score;
    }

    this.userAnswers.push({
      questionId: this.currentQuestionIndex,
      answer: this.selectedAnswer,
      isCorrect
    });

    this.nextQuestion();
  }

  nextQuestion(): void {
    if (!this.quiz || !this.quiz.questions) return;

    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswer = '';
    } else {
      this.completeQuiz();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      // Restaurer la réponse précédente si elle existe
      const previousAnswer = this.userAnswers.find(a => a.questionId === this.currentQuestionIndex);
      if (previousAnswer) {
        this.selectedAnswer = previousAnswer.answer;
      }
    }
  }

  completeQuiz(): void {
    this.isQuizCompleted = true;
    
    // Envoyer les résultats au backend
    const result = {
      quizId: this.quiz?.id,
      score: this.score,
      maxScore: this.quiz?.questions?.reduce((sum, q) => sum + q.score, 0) || 0,
      answers: this.userAnswers,
      completedAt: new Date().toISOString()
    };

    // TODO: Appeler le service de résultats
    console.log('Quiz terminé avec les résultats:', result);
  }

  restartQuiz(): void {
    this.currentQuestionIndex = 0;
    this.selectedAnswer = '';
    this.score = 0;
    this.isQuizCompleted = false;
    this.userAnswers = [];
  }

  goToQuizzes(): void {
    this.router.navigate(['/quiz']);
  }

  getAnswerClass(option: string): string {
    if (!this.isQuizCompleted || !this.currentQuestion) return '';
    
    const isCorrect = option === this.currentQuestion.correctAnswer;
    const userAnswer = this.userAnswers.find(a => a.questionId === this.currentQuestionIndex)?.answer;
    const isSelected = option === userAnswer;

    if (isCorrect) return 'btn-success';
    if (isSelected && !isCorrect) return 'btn-danger';
    return 'btn-outline-secondary';
  }

  getOptionText(option: string): string {
    if (!this.currentQuestion) return '';
    
    switch (option) {
      case 'A': return this.currentQuestion.optionA;
      case 'B': return this.currentQuestion.optionB;
      case 'C': return this.currentQuestion.optionC;
      default: return '';
    }
  }
}
