import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useEffect, useState } from "react"
import {
  ACESFilmicToneMapping,
  EquirectangularRefractionMapping,
  Mesh,
  sRGBEncoding,
  Group,
  MeshStandardMaterial,
  Color
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { Layout } from "./components"

const useLoadMannequin = () => {
  const [mannequin, setMannequin] = useState(new Group())
  useEffect(() => {
    new GLTFLoader().load("/assets/wig_mannequin/scene.gltf", ({ scene }) => {
      scene.scale.set(0.001, 0.001, 0.001)
      scene.position.set(15.3, 1.3, 1.6)
      scene.traverse(object => {
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
      setMannequin(scene)
    })
  }, [])
  return mannequin
}

const Mannequin = () => {
  useFrame(({ scene }) => {
    const { rotation } = scene
    rotation.y += 0.005
  })
  return <primitive object={useLoadMannequin()} />
}

const useSetupScene = () => {
  const { gl, camera, scene } = useThree()
  useEffect(() => {
    new OrbitControls(camera, gl.domElement).update()
    gl.setPixelRatio(devicePixelRatio)
    gl.toneMapping = ACESFilmicToneMapping
    gl.toneMappingExposure = 1
    gl.outputEncoding = sRGBEncoding
    gl.shadowMap.enabled = true
    camera.position.z = 1
    camera.position.y = 0.3
    camera.lookAt(0, 0, 0)
    const hdrUrl = new URL("../public/assets/hdr.hdr", import.meta.url)
    new RGBELoader().load(hdrUrl.href, texture => {
      texture.mapping = EquirectangularRefractionMapping
      scene.environment = texture
      scene.background = new Color("black")
    })
  }, [])
}

const Scene = () => {
  useSetupScene()
  return <Mannequin />
}

export const MyApp = () => (
  <Layout>
    <Canvas gl={{ antialias: true }}>
      <Scene />
    </Canvas>
  </Layout>
)
