import { useState, createContext } from "react";

const CT0001_PlanGroups = createContext({});
export default CT0001_PlanGroups;

export const CT0001_PlanGroupsProvider = ({children}) => {
    const [planGroups, setPlanGroups] = useState([]);
    return (
        <CT0001_PlanGroups.Provider value={{planGroups, setPlanGroups}}>
            {children}
        </CT0001_PlanGroups.Provider>
    );
};