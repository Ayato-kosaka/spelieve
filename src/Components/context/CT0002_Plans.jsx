import { useState, createContext } from "react";

const CT0002_Plans = createContext({plans: {}});
export default CT0002_Plans;

export const CT0002_PlansProvider = ({children}) => {
    const [plans, setPlans] = useState({});
    return (
        <CT0002_Plans.Provider value={{plans, setPlans}}>
            {children}
        </CT0002_Plans.Provider>
    );
};
