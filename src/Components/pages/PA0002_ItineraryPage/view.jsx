import { AT0001_TimeArea } from 'Components/atoms/AT0001_TimeArea/view';
import { AT0002_TitleArea } from 'Components/atoms/AT0002_TitleArea/view';
import { AT0004_PlusButton } from 'Components/atoms/AT0004_PlusButton/view';
import { MC0001_Plan } from 'Components/molecules/MC0001_Plan/view';
import { OG0001_PlanGroupList } from 'Components/organisms/OG0001_PlanGroupList/view';
import { OG0005_PlanGroup } from 'Components/organisms/OG0005_PlanGroup/view';

export const PA0002_ItineraryPage = () => {
  return (
    <>
        <h1>AT0001_TimeArea</h1>
        <AT0001_TimeArea></AT0001_TimeArea>
        <h1>AT0002_TitleArea</h1>
        <AT0002_TitleArea></AT0002_TitleArea>
        <h1>AT0004_PlusButton</h1>
        <AT0004_PlusButton></AT0004_PlusButton>
        <h1>MC0001_Plan</h1>
        <MC0001_Plan></MC0001_Plan>
        <h1>OG0001_PlanGroupList</h1>
        <OG0001_PlanGroupList></OG0001_PlanGroupList>
        <h1>OG0005_PlanGroup</h1>
        <OG0005_PlanGroup></OG0005_PlanGroup>
    </>
  )
}