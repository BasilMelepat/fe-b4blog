import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../header/header"
import { Footer } from "../footer/Footer";
import { Comment } from "../Comment";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Alert, IconButton, Snackbar } from "@mui/material";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


export const Full_Blog = () => {
    const navigate = useNavigate()
    const [comment, setComment] = useState("");
    const [open, setOpen] = useState(false);
    const [snackBarType, setSnackBarType] = useState("success")
    const [snackBarMessage, setSnackBarMessage] = useState("")

    const { id } = useParams();
    const [fullBlog, setFullBlog] = useState("");
    const [allComments, setAllComments] = useState([]);

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ]
    };

    

    function handleChangeComment(e) {
        setComment(e.target.value)
    }

    async function postComment() {

        if (localStorage.getItem("username")) {
            if(!comment){
                setSnackBarType("error")
                setOpen(true);
                setSnackBarMessage("Comment Cannot Be Empty!")
                
                
            }

            else{
                try {
               

                    console.log(comment);
                    // sending comment to save
                    const data = {
                        comment: comment,
                        blog: id,
                        postedBy: localStorage.getItem("username"),
                        postedTime: new Date(),
                    }
    
                    const config = {
                        headers: {
                            "content-type": "application/json"
                        }
                    }
    
                    const response = await axiosInstance.post("/addcomment", data, config);
                    setSnackBarType("success")
                    setOpen(true);
                    setSnackBarMessage("Comment Posted Successfully")
                    setComment("")
    
    
                }
                catch (e) {
                    setSnackBarType("error")
                    setOpen(true);
                    setSnackBarMessage("Error While Posting Comment, Try Again")
                    setComment("")
                }
            }
           



        }


    }


    useEffect(()=>{
        window.scrollTo(0,0)
    },[])

    useEffect(() => {
        

        const getFullBlog = async () => {
            try {
                const response = await axiosInstance.get(`/blog/${id}`, { 
                    params: { blogId: id } 
                });
                const data = response.data.blogData;
                data.createdDate = data.createdDate.slice(0, 10);
                setFullBlog(data);
            } catch (e) {
                navigate("/error");
                console.log(e);
            }
        }

       const fetchComments = async () => {
       try {
              const  config = {
                    headers: {
                        "content-type": "application/json",
                 }
                }
            const  data = {
                    blogId: id
                }

              
               const response =await axiosInstance.post("/fetchComments", data, config)
                const fetchedComments = response.data.data;
                setAllComments(fetchedComments);
               
                

            } catch (e) {
                console.log(e);
            }





        }
        getFullBlog();
        fetchComments();
    }
        , [open])



    return (

        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => { setOpen(false) }}>
                <Alert onClose={() => setOpen(false)} severity={snackBarType} sx={{ width: '100%' }}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
            <Header />



            <div className="blog-container" >


                <img src={fullBlog.picture} alt="" />
                <div className="blog-header" style={{ border: "none", flexDirection: "column", alignItems: "start" }}>
                    <h1 >  {fullBlog.title} </h1>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <p><b> Published On: </b> {fullBlog.createdDate}</p>
                        <p> <b> Author :</b> {fullBlog.username}</p>
                        <p> <b> Category :</b> {fullBlog.categories}</p>
                    </div>

                </div>
                <hr />
                <div className="blog-area" style={{ border: "none", marginTop: "-10px" }} >
                    <p>{fullBlog.description}</p>
                </div>




                <div className="comment-section">
                    <hr />
                    
                        <ReactQuill 
                value={comment}
                onChange={handleChangeComment}
                modules={modules}
                placeholder="Write your comment..."
                className="comment-editor"
            />
                        <IconButton onClick={postComment}>
                            <AddCircleIcon />
                        </IconButton>
                    
                    <hr />

                    <h1>Comments</h1>
                   
                    {allComments.map((comment)=> <Comment key={Math.random()} props={comment} />)}
                    

                </div>
            </div>




            <Footer />
        </div>




    )



}
