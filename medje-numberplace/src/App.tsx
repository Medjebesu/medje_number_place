import './App.css'
import { NumberPlaceGameDisp } from './gameCtrl'
import { HeadsUpDisp } from './hudCtrl'
import { RecoilRoot } from 'recoil'

function App() {

  return (
    <RecoilRoot>
      <NumberPlaceGameDisp/>
      <HeadsUpDisp/>
    </RecoilRoot>
  )
}

export default App
