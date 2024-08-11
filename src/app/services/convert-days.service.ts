import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'any'
})
export class ConvertDaysService {

  constructor() { }

  convertDaysOfDatabaseToIndex(arrInitial:string[], arrToSet:number[], checkbox?:any) {
    return arrInitial.forEach(el => {
      switch (el) {
        case "SUNDAY":
          arrToSet.push(0);
          if(checkbox !== undefined){
            checkbox[0].checked = true;
          }
          break;
        case "MONDAY":
          arrToSet.push(1);
          if(checkbox !== undefined){
            checkbox[1].checked = true;
          }
          break;
        case "TUESDAY":
          arrToSet.push(2);
          if(checkbox !== undefined){
            checkbox[2].checked = true;
          }
          break;
        case "WEDNESDAY":
          arrToSet.push(3);
          if(checkbox !== undefined){
            checkbox[3].checked = true;
          }
          break;
        case "THURSDAY":
          arrToSet.push(4);
          if(checkbox!==undefined){
            checkbox[4].checked = true;
          }
          break;
        case "FRIDAY":
          arrToSet.push(5);
          if(checkbox !== undefined){
            checkbox[5].checked = true;
          }
          break;
        case "SATURDAY":
          arrToSet.push(6);
          if(checkbox !== undefined){
            checkbox[6].checked = true;
          }
          break;
      }
    });
  }

  convertDaysOfIndexToDatabase(arrToReturn:any[], arrToConvert:any[]){
    arrToConvert.forEach(el => {
      switch (el) {
        case 0:
          arrToReturn.push("SUNDAY");
          break;
        case 1:
          arrToReturn.push("MONDAY");
          break;
        case 2:
          arrToReturn.push("TUESDAY");
          break;
        case 3:
          arrToReturn.push("WEDNESDAY");
          break;
        case 4:
          arrToReturn.push("THURSDAY");
          break;
        case 5:
          arrToReturn.push("FRIDAY");
          break;
        case 6:
          arrToReturn.push("SATURDAY");
          break;
      }
  });
}
}
