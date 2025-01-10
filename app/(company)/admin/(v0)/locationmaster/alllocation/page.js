'use client'
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Plus, SquarePen, Trash2 } from "lucide-react"
import { Tooltip, RadioGroup, Radio, Button, Input, Chip, Table,  DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem, TableHeader, TableColumn, TableBody,Pagination, getKeyValue, TableRow, TableCell, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Autocomplete, AutocompleteItem  } from "@nextui-org/react"
import {PlusIcon, SearchIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@/_components/icon";
import Swal from 'sweetalert2'
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import DataTable from "@/_components/ui/DataTable";
import { useSelector } from "react-redux";

const columns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "REGION", uid: "region", sortable: true},
    {name: "COUNTRY", uid: "country", sortable: true},
    {name: "STATE", uid: "state", sortable: true},
    {name: "DISTRICT", uid: "district", sortable: true},
    {name: "CITY", uid: "city", sortable: true},
    {name: "CITY PINCODE", uid: "city_pincode", sortable: true},
    {name: "STATUS", uid: "status", sortable: true},
    {name: "ACTIONS", uid: "actions", sortable: true},
  ];
  
  const statusColorMap = {
    Active: "success",
    Inactive: "danger",
  };
  const statusOptions = [
    {name: "Active", uid: "Active"},
    {name: "Inactive", uid: "Inactive"},
  ];
  
  const propertyareasdata = [
    {
      id: "PAID00001",
      property_area: "Bedroom",
      propertyarea_desc: "Bedroom",
      status: "active",
    },
    {
        id: "PAID00002",
        property_area: "Bathroom",
        propertyarea_desc: "Bathroom",
        status: "active",
    },
    {
        id: "PAID00003",
        property_area: "Kitchen",
        propertyarea_desc: "Kitchen",
        status: "inactive",
    },
  ];




export default function Region() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [ selectedRegion, setSelectedRegion ] = useState();
    const [ selectedCountry, setSelectedCountry ] = useState();
    const [ selectedState, setSelectedState ] = useState();
    const [ selectedDistrict, setSelectedDistrict ] = useState();
    const [ selectedCity, setSelectedCity ] = useState();
    const [ selectedCityPincode, setSelectedCityPincode ] = useState();
    const [ status, setStatus ] = useState('');

    const [ result, setResult ] = useState([]);
    const [ region, setRegion ] = useState([]);
    const [ country, setCountry ] = useState([]);
    const [ state, setState ] = useState([]);
    const [ district, setDistrict ] = useState([]);
    const [ city, setCity ] = useState([]);

    const [ currRowId, setCurrRowId ] = useState('');
    const [actionType, setActionType] = useState(null);
    const [lastID, setLastID] = useState(0);

    const checksRef = useRef();
    checksRef.current = useSelector((state) => state.checks.selectedChecks);


    useEffect(() => {
        initialFxn()
    }, [])


    useEffect(() => {
      console.log("Selected City: ",selectedCity, selectedCityPincode)
  }, [selectedCity, selectedCityPincode])

    

    const initialFxn = async () => {
        try {
            const response = await fetch("/api/locationmaster/locationmaster_alllocation", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            console.log("Data:", result.data);
            setResult(result.data);
            setRegion(result.locationmaster_region)
            setCountry(result.locationmaster_country)
            setState(result.locationmaster_state)
            setDistrict(result.locationmaster_district)
            setCity(result.locationmaster_city)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
       console.log("Region: ",region)
       console.log("Country: ",country)
       console.log("State: ",state)
       console.log("District: ",district)
       console.log("City: ",city)

    }, [region,
        country,
        state,
        district,
        city,
        ])

    function getCurrentDateTime() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const hours = String(today.getHours()).padStart(2, '0');
        const minutes = String(today.getMinutes()).padStart(2, '0');
        const seconds = String(today.getSeconds()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }


    

    const generateUniqueID = () => {
        console.log("Last IF:",lastID)
      const newID = `LCOMB${String(lastID + 1).padStart(5, '0')}`;
      setLastID(lastID + 1);
      return newID;
    };





        // const toast = (action, message) => {
        //     const Toast = Swal.mixin({
        //         toast: true,
        //         position: "top-end",
        //         showConfirmButton: false,
        //         timer: 3000,
        //         timerProgressBar: true,
        //         iconColor : "#90EE90",
        //         didOpen: (toast) => {
        //           toast.onmouseenter = Swal.stopTimer;
        //           toast.onmouseleave = Swal.resumeTimer;
        //         }
        //       });
        //       Toast.fire({
        //         icon: action,
        //         title: message
        //       });
        // }


        // eslint-disable-next-line react-hooks/exhaustive-deps
        const handleSubmit = useCallback(async () => {

            if(actionType === "add") {
                console.log("Add")

                const data = {
                    id: generateUniqueID(),
                    region: selectedRegion.trim(),
                    country: selectedCountry.trim(),
                    state: selectedState.trim(),
                    district: selectedDistrict.trim(),
                    city: selectedCity.trim(),
                    city_pincode: selectedCityPincode.trim(),
                    status: status.trim(),
                    creation_date: getCurrentDateTime().trim(),
                    last_update_on: getCurrentDateTime().trim(),
                };
        
                try {
                    const response = await fetch("/api/locationmaster/locationmaster_alllocation", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    });
                    const result = await response.json();
                    console.log("Data:", result.res);
                    setResult(result.res);
                    onClose()

                    if(result.data.result === "Data already existed") {
                        toast("Data already existed!")
                    }else{
                        toast.success("Data inserted!")
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }else if(actionType === "edit"){
                console.log("EDit")
                try {
                    const response = await fetch("/api/locationmaster/locationmaster_alllocation", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({id: currRowId, action: actionType, region: selectedRegion,
                          country: selectedCountry,
                          state: selectedState,
                          district: selectedDistrict.trim(),
                          city: selectedCity.trim(),
                          city_pincode: selectedCityPincode.trim(),
                            status: status}),
                    });
                    const result = await response.json();
                    console.log("Data:", result);
                    setResult(result.res);
                    onClose()
                    toast.success("Data edited!")
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }else if(actionType === "editmany"){
                console.log("Edit Many: ",checksRef.current);

                try {
                  const response = await fetch("/api/locationmaster/locationmaster_alllocation", {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ids: checksRef.current, action: actionType, 
                          status: status}),
                  });
                  const result = await response.json();
                  console.log("Data:", result);
                  setResult(result.res);
                  onClose()
                  // toast.success("Data edited!")
                  toast.success("Row updated!")
              } catch (error) {
                  console.error("Error fetching data:", error);
              }
            }

        });

        useEffect(() => {
            if (result && result.length > 0) {
                const lastElement = result[result.length - 1]; // Get the last element
                const lastElementId = lastElement.id; // Extract the id property from the last element
                const numericPart = lastElementId.match(/(?<=LCOMB)0*(\d+)/); // Extract numeric part using regular expression
                const lastNumericId = numericPart ? parseInt(numericPart[1]) : null;
                console.log("Numeric ID of the last element:", lastNumericId);
                setLastID(lastNumericId);
            } else {
                console.log("No elements in the array.");
                setLastID(0);
            }
        }, [result,handleSubmit])

        useEffect(() => {
            console.log("REs::::::>",result);
        }, [result])

        useEffect(() => {
            console.log("Status::::::>",status);
            setStatus(status)
        }, [status])

        const rowEdit = async (key,type,desc,statuses) => {
            console.log("Statusuasdfasf: ",statuses);
            setCurrRowId(key)
            // setRegion(type)
            // setRegionDesc(desc)
        }

        useEffect(() => {
            console.log("Current Row ID::::::>",currRowId);
        }, [currRowId])

        const handleOpen = (type) => {
            console.log("Inside Hanlde Open",checksRef.current,type,result.length)
            setActionType(type); 
            if(result && result.length === 0) {
              checksRef.current = [];
              if(type === "editmany" && (checksRef.current).length === 0){
                toast.error("No rows selected!")
              }else{
                onOpen();
              }
              
            }else{
              if(type === "editmany" && (checksRef.current).length === 0){
                toast.error("No rows selected!")
              }else{
                onOpen();
              }
            }
        };

        const handleDelete = async (id, deleteAction,checks) => {
            console.log("Delete Opearion: ",id, deleteAction)
  
            if(deleteAction === "deleteSelected") { 
              
              console.log("Delete Console",checks,checks.length)
  
              if(checks.length === 0 || result && result.length === 0) {
                toast.error("No rows selected!")
              }else{
                Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, delete it!"
                }).then(async (result) => {
                  if (result.isConfirmed) {
      
                    const response = await fetch("/api/locationmaster/locationmaster_alllocation", {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({id: id, action: "deleteSelectedChecks", selectedChecks : checks}),
                  });
                  const result = await response.json();
                  console.log("Data:", result);
                  setResult(result.res);
      
                    Swal.fire({
                      title: "Deleted!",
                      text: "Selected rows has been deleted!",
                      icon: "success"
                    });
                  }
                });
              }
  
        
  
            }else{
              try {
  
                Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, delete it!"
                }).then(async (result) => {
                  if (result.isConfirmed) {
  
                    const response = await fetch("/api/locationmaster/locationmaster_alllocation", {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({id: id, action: "delete"}),
                  });
                  const result = await response.json();
                  console.log("Data:", result);
                  setResult(result.res);
  
  
                    Swal.fire({
                      title: "Deleted!",
                      text: "Selected row has been deleted.",
                      icon: "success"
                    });
                  }
                });
     
              } catch (error) {
                  console.error("Error fetching data:", error);
              }
            }
  
  
  
          };


        useEffect(() => {
            console.log("Action Type::::::>",actionType);
        }, [actionType])
        let actionsContent = (item, onEditClick, onDeleteClick) => (
            <>
              <Tooltip color="default" content="Edit Bed Type">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <Button
                    isIconOnly
                    onPress={() => {
                      onEditClick(item); // Pass item data to the callback function
                      setStatus(item.status);
                      setSelectedRegion(item.region)
                    setSelectedCountry(item.country)
                    setSelectedState(item.state)
                    setSelectedDistrict(item.district)
                    setSelectedCity(item.city)
                    setSelectedCityPincode(item.city_pincode)
                      handleOpen("edit");
                    }}
                    color="default"
                    variant="light"
                    size="sm"
                    onClick={(e) => {
                      rowEdit(item.id,item.region,
                        item.country,
                        item.state,
                        item.district,
                        item.city,item.status);
                    }}
                  >
                    <EditIcon className="size-4" />
                  </Button>
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete Bed Type">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    size="sm"
                    onClick={(e) => {
                      onDeleteClick(item)
                      handleDelete(item.id);
                    }}
                  >
                    <DeleteIcon className="size-4" />
                  </Button>
                </span>
              </Tooltip>
            </>
          );

          const handleClick = () => {
            setCurrRowId('')
            // setRegion('')
            // setRegionDesc('')
            setStatus('')
        };
   
    return (
        <><Toaster
        position="top-right"
        reverseOrder={false} /><div className="w-full">
          <h1 className="flex text-3xl ml-6 mt-6"><PlusIcon className="size-8 mt-1" />Add Location</h1>
          <div className="mr-6 text-end">
            {/* <Button onPress={() => handleOpen("add")} color="primary" variant="shadow" onClick={(e) => {
        setCurrRowId('')
        setRegion('')
        setRegionDesc('')
        setStatus('')
    }}><PlusIcon className="size-6" />Add Property Area</Button> */}
            <Modal isOpen={isOpen} size="4xl" onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="gap-1">Add Region</ModalHeader>
                    <ModalBody>
                      <div className="p-4 grid grid-cols-2 gap-2">
                      {actionType === "editmany" ? '' :
                      <>
                      <Autocomplete
                                                isRequired
                                                labelPlacement="outside"
                                                placeholder="Select...."
                                                label="Region"
                                                variant="bordered"
                                                size="md"
                                                className="max-w-xs"
                                                defaultSelectedKey={actionType === "edit" ? selectedRegion : ''}
                                                value={selectedRegion}
                                                allowsCustomValue={true}
                                                onInputChange={(value) => setSelectedRegion(value)}
                                            >
                                                {Array.isArray(region) && region.map((item) => (
                                                    <AutocompleteItem key={item.region} value={item.region}>
                                                        {item.region}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>
                                            <Autocomplete
                                                isRequired
                                                labelPlacement="outside"
                                                placeholder="Select...."
                                                label="Country"
                                                variant="bordered"
                                                size="md"
                                                className="max-w-xs"
                                                defaultSelectedKey={actionType === "edit" ? selectedCountry : ''}
                                                value={selectedCountry}
                                                allowsCustomValue={true}
                                                onInputChange={(value) => setSelectedCountry(value)}
                                            >
                                                {Array.isArray(country) && country.map((item) => (
                                                    <AutocompleteItem key={item.country} value={item.country}>
                                                        {item.country}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>
                                            <Autocomplete
                                                isRequired
                                                labelPlacement="outside"
                                                placeholder="Select..."
                                                label="State"
                                                variant="bordered"
                                                size="md"
                                                className="max-w-xs"
                                                defaultSelectedKey={actionType === "edit" ? selectedState : ''}
                                                value={selectedState}
                                                allowsCustomValue={true}
                                                onInputChange={(value) => setSelectedState(value)}
                                            >
                                                {Array.isArray(state) && state.map((item) => (
                                                    <AutocompleteItem key={item.state} value={item.state}>
                                                        {item.state}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>
                                            <Autocomplete
                                                isRequired
                                                labelPlacement="outside"
                                                placeholder="Select..."
                                                label="District"
                                                variant="bordered"
                                                size="md"
                                                className="max-w-xs"
                                                defaultSelectedKey={actionType === "edit" ? selectedDistrict : ''}
                                                value={selectedDistrict}
                                                allowsCustomValue={true}
                                                onInputChange={(value) => setSelectedDistrict(value)}
                                            >
                                                {Array.isArray(district) && district.map((item) => (
                                                    <AutocompleteItem key={item.district} value={item.district}>
                                                        {item.district}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>
                                            <Autocomplete
                                                isRequired
                                                labelPlacement="outside"
                                                placeholder="Select...."
                                                label="City"
                                                variant="bordered"
                                                size="md"
                                                className="max-w-xs"
                                                defaultSelectedKey={actionType === "edit" ? selectedCityPincode : ''}
                                                value={selectedCity}
                                                allowsCustomValue={true}
                                                onSelectionChange={(key) => setSelectedCityPincode(key)}
                                                onInputChange={(value) => setSelectedCity(value)}
                                            >
                                                {Array.isArray(city) && city.map((item) => (
                                                    <AutocompleteItem key={item.city_pincode} value={item.city}>
                                                        {item.city}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete></>}
                        <Autocomplete
                          isRequired
                          labelPlacement="outside"
                          placeholder="Select...."
                          label="Location Status"
                          variant="bordered"
                          size="md"
                          className="max-w-xs"
                          defaultSelectedKey={actionType === "edit" ? status : ''}
                          value={status}
                          allowsCustomValue={true}
                          onInputChange={(value) => setStatus(value)}
                        >
                          <AutocompleteItem value="Active" key="Active">Active</AutocompleteItem>
                          <AutocompleteItem value="Inactive" key="Inactive">Inactive</AutocompleteItem>
                        </Autocomplete>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onPress={handleSubmit}>
                        Submit
                      </Button>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
          <div className="mt-10 ml-2 mr-2">
            <DataTable data={result} columns={columns}
              statusOptions={statusOptions} statusColorMap={statusColorMap} columnSort="id" columnName={"region"} actionsContent={actionsContent} operation="region" handleOpen={handleOpen} handleClick={handleClick} handleDelete={handleDelete} handleSubmit={handleSubmit} />
          </div>
        </div></>
    );
};