import { useEffect, useRef } from "react"
import {
  ACESFilmicToneMapping,
  EquirectangularReflectionMapping,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  sRGBEncoding,
  Vector2,
  WebGLRenderer
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Layout } from "./components"

const Canvas = () => {
  const canvasRef = useRef()
  useEffect(() => {
    const gl = new WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current
    })
    gl.setSize(innerWidth, innerHeight)
    gl.toneMapping = ACESFilmicToneMapping
    gl.toneMappingExposure = 1
    gl.outputEncoding = sRGBEncoding
    gl.setPixelRatio(devicePixelRatio)
    gl.shadowMap.enabled = true
    const camera = new PerspectiveCamera(
      45,
      innerWidth / innerHeight,
      0.1,
      1000
    )
    camera.position.z = 1
    camera.position.y = 0.3
    camera.lookAt(0, 0, 0)
    new OrbitControls(camera, gl.domElement).update()
    const scene = new Scene()
    const hdrUrl = new URL("../public/assets/hdr.hdr", import.meta.url)
    new RGBELoader().load(hdrUrl.href, texture => {
      texture.mapping = EquirectangularReflectionMapping
      scene.environment = texture
      scene.background = texture
    })
    const mouse = new Vector2()
    const raycaster = new Raycaster()
    new GLTFLoader().load(
      "/assets/wig_mannequin/scene.gltf",
      ({ scene: mannequin }) => {
        mannequin.scale.set(0.001, 0.001, 0.001)
        mannequin.position.set(15.3, 1.3, 1.6)
        mannequin.traverse(object => {
          if (object instanceof Mesh) {
            object.receiveShadow = true
            object.castShadow = true
            object.material = new MeshStandardMaterial({
              color: "rgb(2, 2, 5)",
              roughness: 0,
              metalness: 0
            })
            if (object.material?.map) object.material.map.anisotropy = 16
          }
        })
        scene.add(mannequin)
      }
    )

    gl.render(scene, camera)
    gl.setAnimationLoop(time => {
      gl.render(scene, camera)
    })

    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight
      camera.updateProjectionMatrix()
      gl.setSize(innerWidth, innerHeight)
    })
    window.addEventListener("mousemove", ({ x, y }) => {
      mouse.x = (x / innerWidth) * 2 - 1
      mouse.y = -((y / innerHeight) * 2 - 1)
      raycaster.setFromCamera(mouse, camera)
    })
  }, [])

  return <canvas ref={canvasRef} />
}
export const MyApp = () => (
  <Layout>
    <Canvas />
  </Layout>
)
