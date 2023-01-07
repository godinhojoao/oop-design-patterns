/* OPEN CLOSED PRINCIPLE (OCP)
 - Objects or entities should be open for extension but closed for modification.
 - Class should be extendable without modifying the class itself.
*/

// SYSTEM
//  We have to generate excel about cars, books and people.

// classes that we will use to "get the data"
class CarsDao {
  static query() {
    return 'cars'
  }
}

class BooksDao {
  static query() {
    return 'books'
  }
}

class PeopleDao {
  static query() {
    return 'people'
  }
}

// WRONG: always when we add a new model to export we have to add another if clause
// WE ARE NOT open to extension and closed to modification
class WrongExcelHandler {
  static generate(type) {
    let data = null
    if (type === 'cars') {
      data = CarsDao.query()
    }

    if (type === 'books') {
      data = BooksDao.query()
    }

    if (type === 'people') {
      data = PeopleDao.query()
    }

    const excel = `${data}.xlsx` // implementation to generate excel
    return excel
  }
}

const wrongCarsExcel = WrongExcelHandler.generate('cars')
const wrongBooksExcel = WrongExcelHandler.generate('books')
const wrongPeopleExcel = WrongExcelHandler.generate('people')

console.log(wrongCarsExcel) // cars.xlsx
console.log(wrongBooksExcel) // books.xlsx
console.log(wrongPeopleExcel) // people.xlsx

// CORRECT: following OCP
class ExcelHandler {
  static generate(dataDao) {
    const data = dataDao.query()
    const excel = `${data}.xlsx` // implementation to generate excel
    return excel
  }
}

const carsExcel = ExcelHandler.generate(CarsDao)
const booksExcel = ExcelHandler.generate(BooksDao)
const peopleExcel = ExcelHandler.generate(PeopleDao)

console.log(carsExcel) // cars.xlsx
console.log(booksExcel) // books.xlsx
console.log(peopleExcel) // people.xlsx