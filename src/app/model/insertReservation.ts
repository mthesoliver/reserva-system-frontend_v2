export class InsertReservation{
    serviceId:number;
    startTime:string;
    endTime:string;
    day:string;
    date:string;
    additionalInfo?:string;
    user:{
        name:string,
        email:string,
        phone:string
    }
}