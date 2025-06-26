import globalConfig from "@/app.config";

export const getRanking = async () => {
    const response = await fetch(
        `${globalConfig.baseUrl}/statistical/ranking`,
        {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        next: {
            tags: ['statistical.ranking'],
        },
        },
    );
    
    const data = await response.json();
    
    return {
        ok: response.ok,
        status: response.status,
        ...data,
    };
}
