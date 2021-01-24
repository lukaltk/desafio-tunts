const { absenceLimit, passingScore, minimumScore } = require("./config")

/**
 * The ReportCard class is responsible for managing the data passed through the spreadsheets
 */
class ReportCard {
  
  /**
   * The constructor receives the data from a spreadsheet and use destructuring assignment to set the parameters
   * @param {String} Matricula Registration number
   * @param {String} Aluno Name of the student
   * @param {Number} Faltas Number of absences
   * @param {Number} P1 First score
   * @param {Number} P2 Second score
   * @param {Number} P3 Third score
   * @param {Number} totalAulasSemestre Total lessons in the semester
   */
  constructor({Matricula, Aluno, Faltas, P1, P2, P3, totalAulasSemestre}){
    this.matricula = Matricula
    this.aluno = Aluno
    this.faltas = Number(Faltas)
    this.p1 = Number(P1)
    this.p2 = Number(P2)
    this.p3 = Number(P3)
    this.totalAulasSemestre = Number(totalAulasSemestre)
    this.situacao = 'Reprovado por Nota'
    this.notaParaAprovacaoFinal = 0
  }

  /**
   * Evaluates the student's situation based on the mean of the 3 tests and the absences rate
   */
  aprove() {

    if(attendance(this.faltas, this.totalAulasSemestre) > absenceLimit) {
      this.situacao = 'Reprovado por Falta'
      return
    }
    
    const scores = [this.p1, this.p2, this.p3]

    if(mean(scores) >= passingScore) {
      this.situacao = 'Aprovado'

    } else if(mean(scores) >= minimumScore) {
      this.situacao = 'Exame Final'
      this.notaParaAprovacaoFinal = calculateNotaParaAprovacaoFinal(mean(scores)) 
    }
  }
  
  /**
   * Return the data to upload in the spreadsheet
   * @returns {Array} The status and the pass score to update in the spreadsheet
   */
  getDataToUpload() {
    return [this.situacao, this.notaParaAprovacaoFinal]
  }

}

/**
 * Calculate the mean of the tests
 * @param   {Number[]} scores Array of the scores
 * @returns {Number}          Mean of the tests
 */
function mean(scores) {
  return scores.reduce((a, b) => a + b, 0) / scores.length
}

/**
 * Calculate the absences rate
 * @param   {Number} absence      Number of absences
 * @param   {Number} totalLessons Total lessons in the semester
 * @returns {Number}              Absences rate
 */
function attendance(absence, totalLessons) {
  return absence / totalLessons
}

/**
 * Calculate the pass score
 * @param   {Number} mean Mean of the tests
 * @returns {Number}      Pass score rounded
 */
function calculateNotaParaAprovacaoFinal(mean) {
  return Math.ceil((minimumScore * 2) - mean)
}

module.exports = ReportCard