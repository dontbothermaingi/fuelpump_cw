import { useState } from "react";

function FuelVehicles(){

    const [formData, setFormData] = useState({
        pump_name:"",
        user_id:"",
        pump_id:"",
        litres:"",
        vehcile_number:"",
    })

    const availablePumps = [
    { id: "PMP001", name: "Pump Alpha" },
    { id: "PMP002", name: "Pump Beta" },
    // ... more pumps
  ];

    function handleChange(e){
        const{name,value} = e.target

        if(name === "pump_id"){

            const selectedPump = 
        }
    }
    return (  );
}
 
export default FuelVehicles;