export const fetchAPI = async (query: any, { variables }: any = {}) => {
    const res = await fetch(process.env.SQUIDEX_API_URL || '', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImMwdmg1Rmw4bnRJRVktc0dBdXF2ZmciLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiJodW1hLWxhbmRpbmc6ZGVmYXVsdCIsIm9pX3Byc3QiOiJodW1hLWxhbmRpbmc6ZGVmYXVsdCIsImNsaWVudF9pZCI6Imh1bWEtbGFuZGluZzpkZWZhdWx0Iiwib2lfdGtuX2lkIjoiYThkMzk4YmQtZWZmMS00YTFhLTgzYjktMTI5MDFkOGZkNGNhIiwiYXVkIjoic2NwOnNxdWlkZXgtYXBpIiwic2NvcGUiOiJzcXVpZGV4LWFwaSIsImV4cCI6MTcyNzE2NzM5MiwiaXNzIjoiaHR0cHM6Ly9zcXVpZGV4LnN0YWdpbmcuaHVtYS5jb20vaWRlbnRpdHktc2VydmVyIiwiaWF0IjoxNzI0NTc1MzkyfQ.INVCJJUQ_ohonJ-EYjncCVSt4ndEEAF7dOY5Zkp3vQh_Q3pMZh5gHsJ4KHj-nwKaXgFPgxrx85xaLj8dkwj1dGkNy4AiueBIfTK6pRz_7Hk6cS5L-16QIErdb2ofg2HABPMw-I42m9335ByEa7W4BQv1t881rNFiBzZ7g6dXWGsDyVEBaK-0ii3ARmFY4J2AiqlPqy61k3rXPU2vRARGI4mz_C1jtNEZgwNKR8EoK_zNp-nYP5N-nv2KNNoTy_smA5jG0eB68CnyT_TbmNKsr6EXy8l1zNwp_yea6pJe2FUXX_SVIBEZz89FF5IXQaf4-4F2RlLb8tLBGtLHZ0CKhw",
        },
        body: JSON.stringify({
            query: query,
            variables,
        }),
    });

    const json = await res.json();

    if (json.errors) {
        console.log(json.errors)
        throw new Error("Failed to fetch API");
    }
    return json.data;
}

export const updateSections = async (data: any) => {
    const sections = JSON.stringify(data.sections).replace(/"([^"]+)":/g, '$1:')
    const header = JSON.stringify(data.header).replace(/"([^"]+)":/g, '$1:')
    const styles = JSON.stringify(data.styles).replace(/"([^"]+)":/g, '$1:')
    const scripts = JSON.stringify(data.scripts).replace(/"([^"]+)":/g, '$1:')
    const query = `mutation {
        updateLandingsContent(
            id: "0fc00590-0a89-405d-982e-9231a76c683f"
            data: {
                header: {
                    iv: ${header}
                }
                styles: {
                    iv: ${styles}
                }
                scripts: {
                    iv: ${scripts}
                }
                sections : {
                    iv:${sections}
                }
            }
        ) {
            id
            data {
            styles {
                iv {
                props
                style
                }
            }
            sections {
                iv {
                props
                name
                content
                }
            }
            }
        }
        }
`;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImMwdmg1Rmw4bnRJRVktc0dBdXF2ZmciLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiJodW1hLWxhbmRpbmc6ZGVmYXVsdCIsIm9pX3Byc3QiOiJodW1hLWxhbmRpbmc6ZGVmYXVsdCIsImNsaWVudF9pZCI6Imh1bWEtbGFuZGluZzpkZWZhdWx0Iiwib2lfdGtuX2lkIjoiYThkMzk4YmQtZWZmMS00YTFhLTgzYjktMTI5MDFkOGZkNGNhIiwiYXVkIjoic2NwOnNxdWlkZXgtYXBpIiwic2NvcGUiOiJzcXVpZGV4LWFwaSIsImV4cCI6MTcyNzE2NzM5MiwiaXNzIjoiaHR0cHM6Ly9zcXVpZGV4LnN0YWdpbmcuaHVtYS5jb20vaWRlbnRpdHktc2VydmVyIiwiaWF0IjoxNzI0NTc1MzkyfQ.INVCJJUQ_ohonJ-EYjncCVSt4ndEEAF7dOY5Zkp3vQh_Q3pMZh5gHsJ4KHj-nwKaXgFPgxrx85xaLj8dkwj1dGkNy4AiueBIfTK6pRz_7Hk6cS5L-16QIErdb2ofg2HABPMw-I42m9335ByEa7W4BQv1t881rNFiBzZ7g6dXWGsDyVEBaK-0ii3ARmFY4J2AiqlPqy61k3rXPU2vRARGI4mz_C1jtNEZgwNKR8EoK_zNp-nYP5N-nv2KNNoTy_smA5jG0eB68CnyT_TbmNKsr6EXy8l1zNwp_yea6pJe2FUXX_SVIBEZz89FF5IXQaf4-4F2RlLb8tLBGtLHZ0CKhw");
    myHeaders.append("Content-Type", "application/json");
    
    const res = await fetch("https://squidex.staging.huma.com/api/content/huma-landing/graphql", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
            query
        }),
        redirect: "follow"
    })
        .catch((error) => console.error(error));

    const json = await res.json()
    if (json.errors) {
        console.log(json.errors)
    }
    return json.data || {};
}