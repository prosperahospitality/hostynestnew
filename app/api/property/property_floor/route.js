import  db  from "@/_lib/mongoDB";
import { Property_Floor } from "@/_lib/model/property/property_floor/property_floor";
import { NextResponse } from "next/server";

export async function GET(){
  let data = [];
  let success=true;
  try {
    db.connect()
    data = await Property_Floor.find();
    console.log("rEs::::>",data);
  } catch (error) {
    data={result:"error"}
    success=false;
  }
  return NextResponse.json({data,success})
}

export async function POST(req){
    const payload = await req.json();
    console.log("Payload: ", payload);
    let data = [];
    let res = [];
    let success = true;
    await db.connect();

    if(payload.action === "edit"){

      console.log("Edit")

      try {

          const property_floor = await Property_Floor.updateOne({ id: payload.id }, {property_floor : payload.property_floor,
            propertyfloor_desc : payload.propertyfloor_desc,
            status : payload.status});

          res = await Property_Floor.find();

          console.log("Result Property: ", property_floor);
          data = { result: "Data updated successfully" };

      } catch (error) {

          console.error("Error:", error);
          data = { result: error };
          success = false;
          
      }
      return NextResponse.json({ data, res, success });

    }else if(payload.action === "delete"){
      console.log("Delete")
      try {

          const property_floor = await Property_Floor.deleteOne({id : payload.id});
          res = await Property_Floor.find();
          console.log("Result Property: ", property_floor);
          data = { result: "Data deleted successfully" };

      } catch (error) {

          console.error("Error:", error);
          data = { result: error };
          success = false;

      }
      return NextResponse.json({ data, res, success });

    }else if(payload.action === "deleteSelectedChecks"){
      console.log("Delete Selected Checks")

      try {

        if((payload.selectedChecks).join('') === 'all') {
          console.log("ALL");

          try {

            const property_floor = await Property_Floor.deleteMany();
            res = await Property_Floor.find();
            console.log("Result Property: ", property_floor);
            data = { result: "Data deleted successfully" };
  
        } catch (error) {
  
            console.error("Error:", error);
            data = { result: error };
            success = false;
  
        }
        return NextResponse.json({ data, res, success });

        }else{

          try {

            console.log("payload.selectedChecks: ",payload.selectedChecks)
            const property_floor = await Property_Floor.deleteMany({ id: { $in: payload.selectedChecks } });
            res = await Property_Floor.find();
            console.log("Result Property: ", property_floor);
            data = { result: "Data deleted successfully" };
            
        } catch (error) {
  
            console.error("Error:", error);
            data = { result: error };
            success = false;
  
        }
        return NextResponse.json({ data, res, success });




        }

        

    } catch (error) {

        console.error("Error:", error);
        data = { result: error };
        success = false;

    }
    return NextResponse.json({ data, res, success });

  }else if(payload.action === "editmany"){
console.log("Edit many",payload.ids,
payload.action,
payload.status)

if((payload.ids).join('') === 'all') {
  try {

    const property_floor = await Property_Floor.updateMany( { } , {status : payload.status});
  
    res = await Property_Floor.find();
  
    console.log("Result Property: ", property_floor);
    data = { result: "Data updated successfully" };
  
  } catch (error) {
  
    console.error("Error:", error);
    data = { result: error };
    success = false;
    
  }
  return NextResponse.json({ data, res, success });
}else{
  try {

    const property_floor = await Property_Floor.updateMany({ id: { $in: payload.ids } }, {status : payload.status});
  
    res = await Property_Floor.find();
  
    console.log("Result Property: ", property_floor);
    data = { result: "Data updated successfully" };
  
  } catch (error) {
  
    console.error("Error:", error);
    data = { result: error };
    success = false;
    
  }
  return NextResponse.json({ data, res, success });
}






  }else {

      console.log("Add")
      try {

        let search = await Property_Floor.find({
          property_floor: { $regex: new RegExp(payload.property_floor, 'i') },
          propertyfloor_desc: { $regex: new RegExp(payload.propertyfloor_desc, 'i') }
      });

        console.log("Search: ",search);
        
        if(search.length === 0) {
          res = await Property_Floor.find();
          payload.serial_id = res.length + 1;
          const property_floor = await Property_Floor.create(payload);
          res = await Property_Floor.find();
          console.log("Result Property: ", property_floor);
          data = { result: "Data inserted successfully" };
        }else {
          res = await Property_Floor.find();
          data = { result: "Data already existed" };
        }


    } catch (error) {

        console.error("Error:", error);
        data = { result: error };
        success = false;

    }
    return NextResponse.json({ data, res, success });





      
    }


}

