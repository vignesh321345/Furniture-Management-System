export const calculate=(date,price,setEstimate,setCal)=>{
    const getCurrentDate=new Date();
   const purchasedDate=new Date(date);
   let yearDiff=getCurrentDate.getFullYear()-purchasedDate.getFullYear();
   let monthDiff=getCurrentDate.getMonth()-purchasedDate.getMonth();
   const totalMonths=yearDiff*12+monthDiff;
    const numericPrice=parseFloat(price)
   const loss=0.01;
   const value=Math.pow(1-loss,totalMonths);
   const saleValue=Math.floor(value*numericPrice);
   if(saleValue>1000){
    const estimator=Math.max(saleValue,500);
    setCal(estimator);
    setEstimate(true);
   }
   else{
    const estimator=Math.max(saleValue,100);
    setCal(estimator);
    setEstimate(true);
   }

}