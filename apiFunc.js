class Corona{
     async get(url){
        let resp= await fetch(url);
        let data= await resp.json();
        return data
     }
     
 }