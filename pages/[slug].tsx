import React, {useEffect } from "react";
import { readCSSFile } from "@/readCssFile";
import { fetchAPI } from "@/lib/squidex";
import { GetServerSideProps } from "next";
import { CanvasV2 } from "@/components/CanvasV2";
import { useRouter } from "next/router";


export const getServerSideProps = (async (context) => {
  const slug = context.params?.slug;
  const cssString = readCSSFile("./components/canvas.module.css");
  const humaCssString = readCSSFile("./styles/huma.css");
  const data = await fetchAPI(`
    {
  findV1LandingsContent(id: "${slug}") {
    id
    flatData {
      
      sections {
        ... on SectionComponentComponent {
          props
          children {
            ... on HumaComponentComponent{
              type
              props
              children {
                props
                type
                value
                children__Dynamic2
              }
            }
          }
        }
      }
     
      scripts {
        script
      }
      styles {
        style
        props
      }
    }
  }
}

`);

  return {
    props: {
      cssString,
      humaCssString,
      data: data?.findV1LandingsContent || {},
    },
  };
}) satisfies GetServerSideProps<{ props }>;
const loadScript = (src) => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };

    document.body.appendChild(script);
  });
};

const Home: React.FC = (props: any) => {
  const router = useRouter();
  useEffect(() => {
    
    // Function to add a link tag
    const addLinkTag = (href) => {
      // Check if the link already exists to avoid duplicates
      if (document.querySelector(`link[href="${href}"]`)) return;

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };

    addLinkTag(
      "https://cdn.prod.website-files.com/6684599c709edcc788d9219e/css/landing-page-huma-workspace.b8e99a11a.min.css"
    );
    addLinkTag('https://cdn.jsdelivr.net/npm/@splidejs/splide@3.2.2/dist/css/splide-core.min.css')

    const scripts = ['https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6684599c709edcc788d9219e','https://cdn.jsdelivr.net/npm/@splidejs/splide@3.2.2/dist/js/splide.min.js']
    const addUrlScripts = async ()=>{
      await Promise.all(scripts.map((src) => loadScript(src)));
      addScripts()

    }
    const addScripts = () => {
      const script = document.createElement("script");
      const scripts = props.data?.flatData.scripts.map((item=> {
        return `${item.script}`
      } )).join('\n');
      script.innerHTML = scripts;
      script.defer = true;
        document.body.appendChild(script);
    };

    addUrlScripts()

    return () => {
      document.head
        .querySelectorAll('link[href^="/path/to/"]')
        .forEach((link) => link.remove());
    };

  }, []); 

  return (
    <>
      {props.data?.flatData ? <CanvasV2 {...props} /> : <></>}
    </>
  );
};

export default Home;
