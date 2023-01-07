
/* SINGLE RESPONSIBILITY PRINCIPLE (SRP)
 - A class should have one and only one reason to change.
 - A class should have only one job.
*/

// SYSTEM
// Let's create an system to generate the excel about the cars!!
// But before it we need to query them.

// WRONG: currently this class has two responsibilities!!!
class WrongExcelHandler {
  generate() {
    const cars = this.queryCars()
    const excel = `${cars}.xlsx` // implementation to generate excel
    return excel
  }

  queryCars() {
    return 'cars'
  }
}

const wrongExcelHandler = new WrongExcelHandler()
const wrongCarsExcel = wrongExcelHandler.generate()
console.log(wrongCarsExcel) // cars.xlsx

// CORRECT: following SRP
class ExcelHandler {
  constructor() { }

  generate() {
    const data = CarsDao.query()
    const excel = `${data}.xlsx` // implementation to generate excel
    return excel
  }
}

class CarsDao {
  static query() {
    return 'cars'
  }
}

const excelHandler = new ExcelHandler()
const carsExcel = excelHandler.generate()
console.log(carsExcel) // cars.xlsx