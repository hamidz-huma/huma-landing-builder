import React, { useContext, useEffect } from "react";
import { Canvas } from "../../components/Canvas";
import { ComponentToolbox } from "../../components/ComponentToolbox";
import { exportHTML } from "@/exportHtml";
import { readCSSFile } from "@/readCssFile";
import { ComponentProperties } from "@/components/ComponentProperties";
import { fetchAPI } from "@/lib/squidex";
import { DndContext, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Frame, { FrameContext } from "react-frame-component";
import { ComponentStyles } from "@/components/ComponentStyles";
import { GetServerSideProps } from "next";

// export async function getStaticPaths() {
//   const idList = ["cb58602e-c62a-4c21-b913-acc9398d8318"];
//   const paths: string[] = [];
//   idList.forEach((id) => {
//     paths.push(`/${id}`);
//   });
//   return { paths, fallback: true };
// }

export const getServerSideProps = (async (context) => {
  const { slug } = context.params;
  const cssString = readCSSFile("./components/canvas.module.css");
  const humaCssString = readCSSFile("./styles/huma.css");

  const data = await fetchAPI(`
   {
  findLandingsContent(id: "${slug}") {
    id
    flatData {
      header {
        props
        name
        content
      }
      sections {
        ... on PageSectionComponent {
          props
          content
          name
        }
      }
      footer
      scripts {
        script
      }
      styles {
        style
        props
      }
    }
  }
}`);
  console.log(data);

  return {
    props: {
      cssString,
      humaCssString,
      data: data?.findLandingsContent || {},
    },
  };
}) satisfies GetServerSideProps<{ props }>;

// export const getStaticProps = async ({ params }: any) => {
//   const { slug } = params;
//   console.log("slug", slug);
//   const cssString = readCSSFile("./components/canvas.module.css");
//   const humaCssString = readCSSFile("./styles/huma.css");
//   const data = await fetchAPI(`
//    {
//   findLandingsContent(id:"${slug}") {
//     id,
//     flatData {
//       header {
//         props
//         name
//         content
//       },
//       sections{
//         props
//         name
//         content
//       },
//       footer,
//       scripts {
//         script
//       },
//       styles {
//         style,
//         props
//       }
//     }
//   }
// }
//       `);

//   return {
//     props: {
//       cssString,
//       humaCssString,
//       data: data?.findLandingsContent || {},
//     },
//   };
// };
//@ts-ignore
export const DndFrame = ({ children }) => {
  const { dragDropManager } = useContext(DndContext);
  const { window } = useContext(FrameContext);

  useEffect(() => {
    //@ts-ignore
    dragDropManager?.getBackend().addEventListeners(window);
  });

  return children;
};
const Home: React.FC = (props: any) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* <ComponentToolbox /> */}

      <div
        id="canvas"
        style={{
          position: "relative",
          width: "calc(100% - 320px)",
          left: "0px",
          right: "320px",
          overflow: "scroll",
          margin: "16px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "5px",
        }}
      >
        {props.data?.flatData ? <Canvas {...props} /> : <></>}
      </div>

      <div
        className="d-flex "
        style={{
          overflow: "scroll",
          padding: "16px",
          borderLeft: "1px solid rgba(100,100,100,0.2)",
          width: "320px",
          right: "0px",
          position: "relative",
        }}
      >
        <ComponentProperties />
        <ComponentStyles />
      </div>
    </div>
  );
};

export default Home;
