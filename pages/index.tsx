import Head from "next/head";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import Container from "../components/container";
import MoreStories from "../components/more-stories";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getAllPostsForHome } from "../lib/api";
import { CMS_NAME } from "../lib/constants";

export default function Index({ allPosts: posts, preview }) {
  const [postsData, setPostsData] = useState(posts?.edges || []);
  const [pageInfo, setPageInfo] = useState(posts?.pageInfo || {});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPostsData(posts?.edges || []);
    setPageInfo(posts?.pageInfo || {});
  }, [posts?.edges]);

  const loadMore = async () => {
    setIsLoading(true);
    const allPosts = await getAllPostsForHome(preview, pageInfo.endCursor);

    const newPosts = postsData.concat( allPosts?.edges || [] );
    setPostsData( newPosts );
    setPageInfo( { ...allPosts?.pageInfo } );
    setIsLoading(false);
  }

  return (
    <Layout preview={preview}>
      <Head>
        <title>Next.js Blog Example with {CMS_NAME}</title>
      </Head>
      <Container>
        <Intro />
        {postsData.length > 0 && <MoreStories posts={postsData} />}
        {pageInfo.hasNextPage && <div style={{
          textAlign: "center",
          marginBottom: "30px"
        }}>
          {
            isLoading ? 'LOADING...' : <button onClick={loadMore} style={{
              cursor: "pointer",
              background: "#000",
              color: "#fff",
              padding: "10px 25px",
            }}>LOADMORE</button>
          }
        </div>}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);

  return {
    props: { allPosts, preview },
    revalidate: 10
  };
};
