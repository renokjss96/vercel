import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import MoreStories from '../../components/more-stories'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import SectionSeparator from '../../components/section-separator'
import Layout from '../../components/layout'
import PostTitle from '../../components/post-title'
import Tags from '../../components/tags'
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api'
import { CMS_NAME } from '../../lib/constants'


const domain = process.env.NEXT_PUBLIC_WORDPRESS_API_URL.replace('graphql', '');

export default function Post({ post, posts, preview }) {
  const router = useRouter();

  if (typeof window !== "undefined" && window.location.search && post.slug) {
    window.location.href = `${domain}${post.slug}`;
  }

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {post.title}
                </title>
                <meta
                  property="og:title"
                  content={post.title}
                />
                <meta
                  property="og:image"
                  content={post.featuredImage?.node.sourceUrl}
                />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.featuredImage}
                date={post.date}
                author={post.author}
                categories={post.categories}
              />
              <PostBody content={post.content} />
              <footer>
                {post.tags.edges.length > 0 && <Tags tags={post.tags} />}
              </footer>
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { slug } = context.params;

  if ((context?.req?.headers?.referer || "").indexOf("facebook.com") !== -1) {
    context.res.setHeader("location", `${domain}${slug}`);
    context.res.statusCode = 301;
    context.res.end();
    return { props: { data: {} } };
  }
  const data = await getPostAndMorePosts(slug, false, {})

  return {
    props: {
      preview: false,
      post: data.post,
      posts: data.posts,
    }
  }
}
