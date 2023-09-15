// pages/ThreejsPreview.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as THREE from 'three';
import "../../public/base.css";
import { FBXLoader } from 'three/addons/loaders/FBXLoader'; // 导入 FBXLoader

export default function model() {

    const router = useRouter();
    var { modelId } = router.query;
    

  useEffect(() => {
    if(modelId){
    if(Number(modelId)<10){
        modelId = "0"+modelId
    }
    const scene = new THREE.Scene();
    
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 更柔和的阴影
    document.body.appendChild(renderer.domElement);

    var canvas = document.querySelector('canvas');

    // 创建天空盒子材质
    const skyboxMaterial = new THREE.MeshBasicMaterial({
        color: 0x87ceeb, // 天空蓝色
        side: THREE.BackSide, // 渲染背面
    });
    
    // 创建天空盒子几何体
    const skyboxGeometry = new THREE.BoxGeometry(100, 100, 100); // 根据需要调整盒子的大小
    
    // 创建天空盒子网格
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    
    // 将天空盒子添加到场景中
    scene.add(skybox);


    // 添加光源
    var light = new THREE.DirectionalLight(0xffffff, 1);
    console.log(light)
    light.position.set( 2, 10, 4);
    
    scene.add(light);

    

    // 创建一个变量用于存储模型
    var model;

    // 创建一个变量用于跟踪鼠标点击状态
    var isMouseDown = false;

    // 创建一个变量用于存储上一次鼠标位置
    var lastMouseX = 0;
    var lastMouseY = 0;
    var autoRotation = true

    // 加载 FBX 模型
    var id= modelId
    var loader = new FBXLoader();
    loader.load('/model/Weapon0'+id+'.fbx', function (object) {
        model = object;
        // 设置模型的位置
        model.position.set(0, 0, 0);
        model.receiveShadow = true; // 启用阴影接收
        model.castShadow = true; // 启用阴影投射

        //渲染纹理贴图
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('/texture/Weapon0'+id+'.png', (texture) => {
        // 创建材质并将纹理贴图应用到材质上
        const material = new THREE.MeshBasicMaterial({ map: texture });

        // 遍历模型的所有子网格，并将材质应用到每个子网格
        model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
            child.material = material;
            }
        });
        });

        scene.add(model);
        
        // 设置相机位置，以便查看模型
        camera.position.set(0,30,30)
        camera.lookAt(scene.position)
        // 渲染场景
        animate();
    });

    

    


    // 鼠标按下事件
    document.addEventListener('mousedown', function (event) {
        isMouseDown = true;
        autoRotation = false
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        canvas.style.cursor = 'grabbing';
    });

    // 鼠标松开事件
    document.addEventListener('mouseup', function () {
        isMouseDown = false;
        deltaX = 0
        deltaY = 0
        if(!isMouseDown){
            canvas.style.cursor = "grab";
        }
    });

    //鼠标右键事件
    document.addEventListener('contextmenu',function(event){
        //关闭菜单栏
        event.preventDefault()
        autoRotation = true
    })

    // 鼠标移动事件
    var deltaX = 0
    var deltaY = 0
    document.addEventListener('mousemove', function (event) {
        if (isMouseDown && model) {
            // 计算鼠标移动的偏移量
            deltaX = event.clientX - lastMouseX;
            deltaY = event.clientY - lastMouseY;
            
            //console.log(deltaX)
            // 根据偏移量旋转模型
            model.rotation.y += (deltaX * 0.01); // 控制水平旋转
            model.rotation.x += deltaY * 0.01
            //model.rotation.x = Math.min(1,Math.max(0,model.rotation.x+deltaY * 0.005)); // 控制垂直旋转

            // 更新上一次鼠标位置
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
        }
    });

    var currentScale = 1; // 当前缩放值
    var targetScale = 1; // 目标缩放值
    //滚轮事件
    document.addEventListener('wheel',function(event){
        
        if (model) {
                // 根据滚轮滚动方向调整缩放比例
                
                if (event.deltaY > 0) {
                    targetScale *= 0.95; // 放大
                } else {
                    targetScale /= 0.95;; // 缩小
                }
                targetScale = Math.min(2,Math.max(1,targetScale))
                
            }
    })

    // 渲染循环
    function animate() {
        if(model){
        // 使用线性插值更新当前缩放值
        currentScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.05);
        model.scale.set(currentScale,currentScale,currentScale)
        if(autoRotation){
            model.rotation.y +=0.01
        }
        
        }
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    }
    animate();
    }
    
  }, [modelId]);

  return (
    <>
    
    <div id="threejs-container">
      
      </div>
    </>
    
  );
}
