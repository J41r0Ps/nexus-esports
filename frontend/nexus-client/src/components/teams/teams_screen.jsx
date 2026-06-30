import { useAuth0 } from "@auth0/auth0-react";
import TeamsService from '@/api/teams_service';
import Layout from "@/layout_template";

function TeamsScreen() {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const testCreate = async () => {
        try {
            const token = await getAccessTokenSilently();
            const result = await TeamsService.createTeam({
                name: "Test Team",
                tag: "TST",
                region: "EU",
                foundedYear: 2024,
                gameId: 26,
                organizationId: 41,
                countryId: 116
            }, token);
            console.log("Created:", result.data);
            alert("Team created! Check console.");
        } catch (error) {
            console.log("Status:", error.response?.status);
            console.log("Body:", error.response?.data);
            alert(`Error: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
        }
    };

    return (
        <Layout title="Teams">
            {isAuthenticated && (
                <button className="btn btn-success mb-3" onClick={testCreate}>
                    Test Create Team (Admin Only)
                </button>
            )}
        </Layout>
    );
}

export default TeamsScreen;