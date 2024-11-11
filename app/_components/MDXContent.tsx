import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
// import shortcodes from '../shortcodes/all';

type MDXContentProps<P> = {
  content?: string;
  components?: Record<string, React.FunctionComponent<P>>;
  className?: string;
};

function MDXContent<P>({ content, components, className = 'article' }: MDXContentProps<P>) {
  const mdxOptions = {
    remarkPlugins: [remarkGfm],
  };
  return (
    <div className={className ? `content ${className}` : "content"} >
      <MDXRemote
        source={content ?? ""}
        components={components}
        options={{ mdxOptions }}
      />
    </div>
  );
}

export default MDXContent;
