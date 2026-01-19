import { Button } from "./components/buttom";
import { PlusIcon } from "./icons/plusIcon";

export function App() {

  return (
    <>
      <Button  startIcon={<PlusIcon size="md"/>} varient="primary" size="md" text="Share Brain" onclick={()=>{}}></Button>
      <Button varient="secondary" size="md" text="Add Content" onclick={()=>{}}></Button>
    </>
  )
}
