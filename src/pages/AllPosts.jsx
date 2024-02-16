import { useEffect, useState } from "react"
import { Layout } from "../components/Layout"
import { client } from "../lib/createClient";
import { Link } from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination';

export const AllPosts = () => {
    const [categories, setCategories] = useState([]); // retorna um array
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        client
            .getEntries({
                content_type: 'blogPost',
                order: "-sys.createdAt"
            })
            .then(function (entries) {
                console.log('posts', entries.items);
                setPosts(entries.items);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });

        client
            .getEntries({
                content_type: 'blogCategory',
            })
            .then(function (entries) {
                console.log('categorias', entries.items);
                setCategories(entries.items);
            })
            .catch(error => {
                console.error('Error fetching categorias:', error);
            });
    }, []); // array vazio indica o onload do componente

    // Pagination vars
    const postsPerPage = 3;
    const totalNumberOfPages = Math.ceil(posts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const postsToDisplay = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalNumberOfPages)
            setCurrentPage(pageNumber);
    };

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <main className="col-md-8">
                        <h1 className="my-3">Posts</h1>

                        {postsToDisplay.map(post => (
                            <div className="card mb-3" key={post.sys.id}>
                                <div className="card-body">
                                    <h5 className="card-title">{post.fields.postTitle}</h5>
                                    <p className="card-text">{post.fields.postDescription}</p>
                                    <Link to={`/post/${post.fields.postSlug}`} className="card-link">
                                        Ver post
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </main>

                    <aside className="col-md-4">
                        <h2>Categorias</h2>
                        <ul>
                            {categories.map(category => (
                                <li key={category.sys.id}>{category.fields.categoryTitle}</li>
                            ))}
                        </ul>
                    </aside>
                </div>

                <div className="row">
                    <div className="col-md-8">
                        <Pagination size="sm">
                            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
                            {Array.from({ length: totalNumberOfPages }).map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
                        </Pagination>
                    </div>
                </div>
            </div>

        </Layout>
    )
}