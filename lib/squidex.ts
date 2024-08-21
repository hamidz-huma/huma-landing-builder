export const fetchAPI = async (query: any, { variables }: any = {}) => {
    const res = await fetch(process.env.SQUIDEX_API_URL || '', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImMwdmg1Rmw4bnRJRVktc0dBdXF2ZmciLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiJodW1hLWxhbmRpbmc6ZGVmYXVsdCIsIm9pX3Byc3QiOiJodW1hLWxhbmRpbmc6ZGVmYXVsdCIsImNsaWVudF9pZCI6Imh1bWEtbGFuZGluZzpkZWZhdWx0Iiwib2lfdGtuX2lkIjoiZWZiMTRhZmMtYTU3Mi00NjViLWEzYjAtMWUzNzdmZjcwZDBjIiwiYXVkIjoic2NwOnNxdWlkZXgtYXBpIiwic2NvcGUiOiJzcXVpZGV4LWFwaSIsImV4cCI6MTcyNjMxNDQ0NCwiaXNzIjoiaHR0cHM6Ly9zcXVpZGV4LnN0YWdpbmcuaHVtYS5jb20vaWRlbnRpdHktc2VydmVyIiwiaWF0IjoxNzIzNzIyNDQ0fQ.p_UNBEFL6JIpfyeT7d3sUE-q5gyZ6sUi88UHqoq6TerXPGPn3YRxeNvZBQBZticOETfHH4Fak_HqmUtnOchN1aUuKR751MY7x9PROErvFxRIiEGx00gkKdC6x_5hn_kC3pcJxe_lRCNcgxpgkstagS0JSyp_bBqe7MNZfwKApO87H827xxzxwpuqvE6PKKmZVxxOsm7mIy8_GaMK8k9kOdPRJEV-MtlLJGPJ1G0-NlwcmgoLBVFwctx8xFbk3AXCR3QFagk-ImMfd_5VY69IwT4327_LwYUDCNaM0-mmYLfZdvDjyvmhYToQmm_Cfz8shM-cqmMck9VdO5t-OyzFNw",
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });
    const json = await res.json();

    if (json.errors) {
        throw new Error("Failed to fetch API");
    }
    return json.data;
}