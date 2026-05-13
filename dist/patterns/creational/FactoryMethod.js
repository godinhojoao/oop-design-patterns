"use strict";
/*
## Description:
- Define an interface for creating an object, but let subclasses decide which class to instantiate.
Factory Method allows subclasses to alter the type of objects that will be created.

## Problem
- We need to export two different file types: excel and pdf.
- But the "Export Method" can be optionally the same or not, what changes is the "Export Product".

## Solution
- Factory Method: A class that delegates to the subclasses the object creation.
In this way the same method could return different results or "products", changing all application behaviour.
*/
// -----> WRONG: More than one responsibility, if we wanna add new file types is needed to add new if clauses
class WrongExcelFileCreator {
    create() {
        return { data: 'excel' };
    }
}
class WrongPdfFileCreator {
    create() {
        return { data: 'pdf' };
    }
}
class WrongFileExporter {
    export(prodcutType) {
        let file = { data: '' };
        if (prodcutType === 'excel') {
            const wrongExcelFileCreator = new WrongExcelFileCreator();
            file = wrongExcelFileCreator.create();
        }
        if (prodcutType === 'pdf') {
            const wrongPdfFileCreator = new WrongPdfFileCreator();
            file = wrongPdfFileCreator.create();
        }
        return `Creator exporting product: ${file.data}`;
    }
}
const wrongFileExporter = new WrongFileExporter();
console.log(wrongFileExporter.export('excel')); // Creator exporting product: excel
console.log(wrongFileExporter.export('pdf')); // Creator exporting product: pdf
// Product implementation
class ExcelHandler {
    create() {
        return { data: 'excel' };
    }
    ;
}
class PdfHandler {
    create() {
        return { data: 'pdf' };
    }
    ;
}
// Factory, "Creator"
class FileExporter {
    // this method is the same for the exporters ( creators )
    // we can change this method using inheritance, but it's not obligatory
    export() {
        const product = this.createFileHandler();
        const file = product.create();
        return `Creator exporting product: ${file.data}`;
    }
}
// Factory implementations
class ExcelExporter extends FileExporter {
    createFileHandler() {
        return new ExcelHandler();
    }
}
class PdfExporter extends FileExporter {
    createFileHandler() {
        return new PdfHandler();
    }
}
const excelExporter = new ExcelExporter();
console.log(excelExporter.export()); // Creator exporting product: excel
const pdfExporter = new PdfExporter();
console.log(pdfExporter.export()); // Creator exporting product: pdf
