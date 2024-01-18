import './App.css'
import { AppInitializer } from './AppInitializer'
import { NumberPlaceGameDisp } from './gameCtrl'
import { HeadsUpDisp } from './hudCtrl'
import { RecoilRoot } from 'recoil'

function App() {

  return (
    <RecoilRoot>
      <AppInitializer/>
      <main id ="main_contents">
        <section id="hud_area">
          <HeadsUpDisp/>
        </section>
        <section id="game_area">
          <NumberPlaceGameDisp />
        </section>
      </main>
    </RecoilRoot>
  )
}

export default App
