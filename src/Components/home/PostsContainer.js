import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import axiosInstance from "../axiosInstance";
import { CircularProgress } from "@mui/material";

export const PostsContainer = (props) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {

        const fetchPosts = async () => {
            setLoading(true)
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            }

            const data = {
                category: props.category,
            }

            console.log(`${data} called from postContainer`);
            try {
                const response = await axiosInstance.post("/getPosts", data, config)
                setPosts(response.data.blogs);
                setLoading(false)
            }

            catch (e) {
                console.log(e);
                setLoading(false)

            }
        }

        fetchPosts();



    }, [props.category])






    return <div className="posts-container">

        

        {isLoading? <CircularProgress color="success" /> : 


      

        posts.length === 0 ? <h1 style={{alignSelf:"center",justifySelf:"center", textTransform:"capitalize"}}> Be the first to Upload Blog of this Category </h1> :

            posts.map((post) => {
             return (<PostCard key={Math.random()} post={post} />)

            })
        

        }



    </div>
}
