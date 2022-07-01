import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Outline,
  EffectComposer,
  Select,
  Selection,
  SelectiveBloom
} from "@react-three/postprocessing"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ACESFilmicToneMapping,
  EquirectangularRefractionMapping,
  Mesh,
  sRGBEncoding,
  Group,
  MeshPhysicalMaterial,
  Float32BufferAttribute,
  Vector3
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { GizmoHelper, GizmoViewport } from "@react-three/drei"
import { Layout } from "./components"

const MannequinMaterial = new MeshPhysicalMaterial({
  color: "white",
  roughness: 0,
  metalness: 0,
  transmission: 0,
  ior: 1.5,
  specularIntensity: 1.5,
  emissiveIntensity: 0.5
})

const SphereMaterial = new MeshPhysicalMaterial({
  color: "red",
  roughness: 0,
  metalness: 0,
  emissiveIntensity: 0.5
})

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
          object.material = MannequinMaterial
          if (object.material?.map) object.material.map.anisotropy = 16
        }
      })
      setMannequin(scene)
    })
  }, [])
  return mannequin
}

const Mannequin = () => {
  const manequinRef = useRef()
  const boxRef = useRef()
  boxRef.current?.geometry.translate(0, 0.05, 0)
  boxRef.current?.geometry.rotateX(Math.PI / 2)
  useFrame(({ raycaster }) => {
    const intersection = raycaster.intersectObject(manequinRef.current)
    if (intersection.length > 0) {
      const [{ point, face }] = intersection
      boxRef.current.position.copy(point)
      boxRef.current.lookAt(face.normal)
    }
  })
  return (
    <Select enabled={false}>
      <mesh ref={manequinRef}>
        <sphereGeometry args={[0.3, 50, 50]} />
      </mesh>
      <group>
        <primitive object={useLoadMannequin()} />
      </group>
      <mesh ref={boxRef} material={SphereMaterial}>
        <coneBufferGeometry args={[0.01, 0.06, 8]} />
      </mesh>
    </Select>
  )
}

const Line = () => {
  const position = useMemo(() => {
    const position = []
  }, [])
  return (
    <mesh>
      <bufferGeometry position={new Float32BufferAttribute(position, 3)} />
      <lineBasicMaterial color="white" />
    </mesh>
  )
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
    camera.position.x = 0
    camera.position.y = 1
    camera.position.z = 0
    camera.lookAt(0, 0, 0)
    const hdrUrl = new URL("../public/assets/hdr.hdr", import.meta.url)
    new RGBELoader().load(hdrUrl.href, texture => {
      texture.mapping = EquirectangularRefractionMapping
      scene.environment = texture
    })
  }, [])
}

const Scene = () => {
  useSetupScene()
  return (
    <Selection>
      <axesHelper args={[10]} />
      <Mannequin />
      <EffectComposer autoClear={false} multisampling={8}>
        <Outline blur visibleEdgeColor="red" edgeStrength={100} />
        <SelectiveBloom
          intensity={1.3}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.025}
        />
      </EffectComposer>
      <GizmoHelper
        alignment="bottom-right"
        margin={[80, 80]}
        renderPriority={2}
      >
        <GizmoViewport
          axisColors={["hotpink", "aquamarine", "#3498DB"]}
          labelColor="black"
        />
      </GizmoHelper>
    </Selection>
  )
}

export const MyApp = () => (
  <Layout>
    <Canvas gl={{ antialias: true }}>
      <Scene />
    </Canvas>
  </Layout>
)
