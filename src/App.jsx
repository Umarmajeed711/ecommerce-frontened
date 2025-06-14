import { useFormik } from "formik";
// import yup
import * as yup from "yup";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import Swal from "sweetalert2";

const App = () => {
  const baseUrl = "https://ecommerce-backend-two-vert.vercel.app/";
  // https://ecommerce-backend-two-vert.vercel.app/

  const [Products, setProducts] = useState([]);
  const [apiload, setApiLoad] = useState(false);
  const [editId , setEditId] = useState("")
  const [show,setShow] = useState(false)

  useEffect(() => {
    axios
      .get(`${baseUrl}products`)
      .then((res) => {
        console.log(res);
        setProducts(res?.data?.productList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [apiload]);

  const productValiditon = yup.object({
    productName: yup.string().required("Product name is required"),
    productPrice: yup.number().required("Product price is required"),
    productDescription: yup
      .string()
      .required("Product description is required"),
  });

  const addProductFormik = useFormik({
    initialValues: {
      productName: "",
      productPrice: "",
      productDescription: "",
    },
    validationSchema: productValiditon,

    onSubmit: (values) => {
      // console.log(values);



      axios
        .post(`${baseUrl}product`, {
          productName: values.productName,
          productPrice: values.productPrice,
          productDescription: values.productDescription,
        })
        .then((res) => {
          console.log(res);
          setApiLoad(!apiload);

          Swal.fire({
            title: "Product Add Successfully!",
            icon: "success",
            draggable: true,
          });
        })
        .catch((error) => {
          console.log("Error: ", error);
        });

      addProductFormik.resetForm();
    },
  });

  let Styles = {
    inputField: "border-2 border-black rounded  p-1  ",
  };

  const deleteProduct = (id) => {
    axios.delete(`${baseUrl}product/${id}`)
    .then((res) => {
      console.log(res);
      setApiLoad(!apiload);
      Swal.fire({
        title: "Product Delete  Successfully!",
        icon: "success",
        draggable: true,
      });
    })
    .catch((error) => {
        console.log("Error: ", error)

    });
  };



  const editFunction = (eachProduct) => {

    addProductFormik.setFieldValue("productName" , eachProduct.productName)
    addProductFormik.setFieldValue("productPrice" , eachProduct.productPrice)
    addProductFormik.setFieldValue("productDescription" , eachProduct.productDescription)
    setEditId(eachProduct.id)
    setShow(true)
    console.log("Edit function call");
    

  }

  const closePopup = () => {
    addProductFormik.resetForm()
    setEditId("")
    setShow(false)
    

  }


  const editSubmit= (e) => {
    e.preventDefault()
    

    axios.put(`${baseUrl}product/${editId}`,{
      productName :  addProductFormik.values.productName,
      productPrice : addProductFormik.values.productPrice,
      productDescription : addProductFormik.values.productDescription
    }
  ).then((res) => {
    console.log(res)
    closePopup()
    setApiLoad(!apiload)
    Swal.fire({
      title: "Product Edit Successfully!",
      icon: "success",
      draggable: true,
    });

  })
  .catch((error) => {
    console.log("Error: ",error)
  })
    

  }

  return (
    <div className="flex  items-center flex-col h-screen ">
      {/* Add product Form */}
      <div>
        <p className="text-center text-3xl font-bold py-3 mt-8">
          Product Detail Form
        </p>
        <form
          onSubmit={addProductFormik.handleSubmit}
          className="min-w-96 flex   gap-3 flex-col border-2 border-black p-5 rounded shadow-2xl"
        >
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="text-xl flex justify-between ">
              <span>Name:</span>
              <div>
                <input
                  type="text"
                  id="name"
                  name="productName"
                  value={addProductFormik.values.productName}
                  onChange={addProductFormik.handleChange}
                  className={Styles.inputField}
                />

                {addProductFormik.touched.productName &&
                Boolean(addProductFormik.errors.productName) ? (
                  <p className="requiredError">
                    {addProductFormik.touched.productName &&
                      addProductFormik.errors.productName}
                  </p>
                ) : null}
              </div>
            </label>
          </div>
          {/* Product Price */}
          <div>
            <label htmlFor="price" className="text-xl flex justify-between">
              <span>Price:</span>

              <div>
                <input
                  type="number"
                  id="price"
                  name="productPrice"
                  value={addProductFormik.values.productPrice}
                  onChange={addProductFormik.handleChange}
                  className={Styles.inputField}
                />

                {addProductFormik.touched.productPrice &&
                Boolean(addProductFormik.errors.productPrice) ? (
                  <p className="requiredError">
                    {addProductFormik.touched.productPrice &&
                      addProductFormik.errors.productPrice}
                  </p>
                ) : null}
              </div>
            </label>
          </div>
          {/* Product Description */}
          <div>
            <label
              htmlFor="description"
              className="text-xl flex  justify-between"
            >
              <span>Description:</span>
              <div>
                <textarea
                  type="text"
                  id="description"
                  name="productDescription"
                  value={addProductFormik.values.productDescription}
                  onChange={addProductFormik.handleChange}
                  className="min-w-full border-2 border-black rounded  p-1 "
                ></textarea>

                {addProductFormik.touched.productDescription &&
                Boolean(addProductFormik.errors.productDescription) ? (
                  <p className="requiredError">
                    {addProductFormik.touched.productDescription &&
                      addProductFormik.errors.productDescription}
                  </p>
                ) : null}
              </div>
            </label>
          </div>

          <div className="flex justify-center">
            <input
              type="submit"
              value="Add Product"
              className="border px-3 py-2 rounded bg-green-300"
            />
          </div>
        </form>
      </div>

      {/* list All the Products */}

      <div>
        <div className="grid grid-cols-3 gap-3 lg:px-20  my-10">
          {Products?.map((eachProduct, i) => {
            return (
              <div
                key={i}
                className="col-span-1 relative border-2 bg-green-100 border-gray shadow-lg text-xl  h-full rounded flex flex-col gap-5  p-3"
              >
                <div className="flex justify-end gap-2">
                  <button
                    className="hover:text-green-600 hover:shadow"
                    onClick={() => {
                      editFunction(eachProduct);
                    }}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className="hover:text-red-600 hover:shadow"
                    onClick={() => {
                      Swal.fire({
                        title: "Do you want to Delete this product?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Delete",
                      }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                          deleteProduct(eachProduct?.id);
                        } else if (result.isDenied) {
                          Swal.fire("Changes are not saved", "", "info");
                        }
                      });
                    }}
                  >
                    <RiDeleteBack2Fill />
                  </button>
                </div>
                <p>
                  Name:{" "}
                  <span className="text-green-500">
                    {eachProduct?.productName}
                  </span>
                </p>
                <p>
                  Price:{" "}
                  <span className="text-green-500">
                    {eachProduct?.productPrice}
                  </span>{" "}
                </p>
                <p>
                  Description:{" "}
                  <span className="text-green-500">
                    {eachProduct?.productDescription}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      


      {/* Popup for edit products */}
       {/* Add product Form */}
      {(show) ? 
       <div className="popupScreen"  >
    
        <div className="popup"  >
        <form
          onSubmit={(e) => editSubmit(e)}
          // className="min-w-96 flex   gap-3 flex-col border-2 border-black p-5 rounded shadow-2xl"
          
        >
          <div className="flex  justify-end ">
            <span onClick={closePopup} className="text-xl hover:text-red-500 hover:shadow-xl"><RiDeleteBack2Fill /></span>
          </div>
          {/* Product Name */}
          <div >
            <label htmlFor="name" className="text-xl flex justify-between  mt-3">
              <span>Name:</span>
              <div>
                <input
                  type="text"
                  id="name"
                  name="productName"
                  value={addProductFormik.values.productName}
                  onChange={addProductFormik.handleChange}
                  className={Styles.inputField}
                />

                {addProductFormik.touched.productName &&
                Boolean(addProductFormik.errors.productName) ? (
                  <p className="requiredError">
                    {addProductFormik.touched.productName &&
                      addProductFormik.errors.productName}
                  </p>
                ) : null}
              </div>
            </label>
          </div>
          {/* Product Price */}
          <div>
            <label htmlFor="price" className="text-xl flex justify-between mt-3">
              <span>Price:</span>

              <div>
                <input
                  type="number"
                  id="price"
                  name="productPrice"
                  value={addProductFormik.values.productPrice}
                  onChange={addProductFormik.handleChange}
                  className={Styles.inputField}
                />

                {addProductFormik.touched.productPrice &&
                Boolean(addProductFormik.errors.productPrice) ? (
                  <p className="requiredError">
                    {addProductFormik.touched.productPrice &&
                      addProductFormik.errors.productPrice}
                  </p>
                ) : null}
              </div>
            </label>
          </div>
          {/* Product Description */}
          <div>
            <label
              htmlFor="description"
              className="text-xl flex  justify-between mt-3"
            >
              <span>Description:</span>
              <div>
                <textarea
                  type="text"
                  id="description"
                  name="productDescription"
                  value={addProductFormik.values.productDescription}
                  onChange={addProductFormik.handleChange}
                  className="min-w-full border-2 border-black rounded  p-1 "
                ></textarea>

                {addProductFormik.touched.productDescription &&
                Boolean(addProductFormik.errors.productDescription) ? (
                  <p className="requiredError">
                    {addProductFormik.touched.productDescription &&
                      addProductFormik.errors.productDescription}
                  </p>
                ) : null}
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-3">
            
            <div>
            <input
              type="submit"
              value="submit"
              className="border px-3 py-2 rounded bg-green-300"
            />
            </div>
            <div>
            <input
              type="button"
              value="Cancel"
              onClick={closePopup}
              className="border px-3 py-2 rounded bg-gray-300"
            />
            </div>
          </div>
        </form>
        </div>
      </div> :
      null
}



    </div>
  );
};

export default App;
