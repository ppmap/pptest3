const yearsList = [
  1930,
  1940,
  1950,
  1960,
  1970,
  1980,
  1990,
  2000,
  2010,
  2020,
  2030
]

const startYear = 1900;
const endYear = 2021;

/*************************************************************************************/

const showLayer = (tile, upYear, lwYear, filterArr) => {
  const upYears = Math.ceil(upYear/10)*10;
  const lwYears = Math.floor(lwYear/10)*10;
  
  //フィルタ条件の整理
  const filterYear = [
          'all'
  ];
      
  const filter = filterYear.concat(filterArr);

  
  //各年代のソース・レイヤ追加
  //yearsList.forEach( ys => {
    
    const ys = 0;
    
    //大縮尺用
    const sourceid = tile + '-' + ys + 's';
    const layerid = tile + '-' + ys + 's';
    
    //小縮尺用（クラスタリング）
    const sourceidszl = sourceid + '-szl';
    const layeridszl = layerid + '-szl';
    
    
    
    //既存のソース・レイヤを削除
    //既存のソースをそのまま利用できるように、年代に応じてソース削除の有無あり
    
    if(ys && +ys > lwYears && upYears <= +ys){
      
      if(map.getLayer(layerid + 'debug')){
        map.removeLayer(layerid + 'debug');
      }
      if(map.getLayer(layerid)){
        map.removeLayer(layerid);
        if(map.getSource(sourceid)){
          map.removeSource(sourceid);
        }
      }
      //小縮尺用（クラスタリング）
      if(map.getLayer(layeridszl + 'text')){
        map.removeLayer(layeridszl + 'text');
      }
      if(map.getLayer(layeridszl)){
        map.removeLayer(layeridszl);
        if(map.getSource(sourceidszl)){
          map.removeSource(sourceidszl);
        }
      }
      
    }else{
    
      if(map.getLayer(layerid + 'debug')){
        map.removeLayer(layerid + 'debug');
      }
      if(map.getLayer(layerid)){
        map.removeLayer(layerid);
      }
      if(map.getLayer(layeridszl)){
        map.removeLayer(layeridszl);
      }
      if(map.getLayer(layeridszl + 'text')){
        map.removeLayer(layeridszl + 'text');
      }
    
    
    }
    
    
    //チェックボックスの確認
    //アイコンの色
    let circleColorRgb = [255,255,255];
    if(tile == "photo"){
      if(!document.selection.selectPp.checked) return;
      circleColorRgb = [255,0,0];
    }else if(tile == "photo2"){
      if(!document.selection.selectPp2.checked) return;
      circleColorRgb = [0,255,0];
    }else if(tile == "photo3"){
      if(!document.selection.selectPp3.checked) return;
      circleColorRgb = [0,0,255];
    }else{
      circleColorRgb = [100,100,100];
    }
    
    
    
    //if(+ys >= lwYears && upYears > +ys){
      
      //console.log('-', ys);

      //大縮尺用ソース・レイヤの追加
      if(!map.getSource(sourceid)){
        map.addSource(sourceid, {
          type: 'vector',
          //tiles: [root + '/pbf/' + tile + '/' + ys + 's/{z}/{x}/{y}.pbf'],
          tiles: [root + '/xyz/' + tile + '/{z}/{x}/{y}.pbf'],
          minzoom: 11,
          maxzoom: 11
        });
      }
      
      /* debug用
      map.addLayer({
        'id': sourceid + 'debug',
        'type': 'circle',
        'source': sourceid,
        'minzoom': 11,
        'maxzoom': 22,
        'layout': {
          'visibility': 'visible'
        },
        'paint': {
          'circle-radius': 10,
          'circle-color': ['rgba', circleColorRgb[0], circleColorRgb[1], circleColorRgb[2], 1]
        },
        'source-layer': 'single'
      });
      */
      
      map.addLayer({
        'id': sourceid,
        'type': 'circle',
        'source': sourceid,
        'minzoom': 11,
        'maxzoom': 22,
        'filter': filter,
        'layout': {
          'visibility': 'visible'
        },
        'paint': {
          'circle-radius': 5,
          'circle-color': ['rgba', circleColorRgb[0], circleColorRgb[1], circleColorRgb[2], 1]
        },
        'source-layer': 'single'
      });
      
      console.log('-', ys);
      
      
      
    //} //if(+ys >= lwYears && upYears > +ys){
    
    /**************************************************************/
    
    //小縮尺用にクラスタリングしたタイル
    
    
      
    if(!map.getSource(sourceidszl)){
      map.addSource(sourceidszl, {
        type: 'vector',
        tiles: [root + '/xyz/' + tile + '/{z}/{x}/{y}.pbf'],
        minzoom: 6,
        maxzoom: 10
      });
    }
    
    map.addLayer({
      'id': sourceidszl,
      'type': 'circle',
      'source': sourceidszl,
      'minzoom': 6,
      'maxzoom': 11,
      'filter': filter,
      'layout': {
        'visibility': 'visible'
      },
      'paint': {
        'circle-radius': 16,
        'circle-color': ['rgba', circleColorRgb[0], circleColorRgb[1], circleColorRgb[2], 0.3]
      },
      'source-layer': 'cluster'
    });
    map.addLayer({
      'id': sourceidszl + 'text',
      'type': 'symbol',
      'source': sourceidszl,
      'minzoom': 6,
      'maxzoom': 11,
      'filter': filter,
      'layout': {
        'text-field': ["case",
          ["has", "point_count"],["get", "point_count"],
          "1"
        ],
        'text-variable-anchor': ["center", "left", "right", "top", "bottom"],
        'text-font': ["NotoSansCJKjp-Regular"],
        'text-allow-overlap': false,
        'symbol-sort-key': ["case",
          ["has", "point_count"],["get", "point_count"],
          1
        ],
        'visibility': 'visible'
      },
      'paint': {
        'text-color': ['rgba', 0,0,0,1],
        'text-halo-color': ['rgba', 255,255,255,1],
        'text-halo-width': 2
      },
      'source-layer': 'cluster'
    });
    
    
    /**************************************************************/
    
  //}) //forEach
  
}

const refleshLayer = (tile) =>{
  
  //年で絞り込み
  const l = +document.question.lower.value;
  const u = +document.question.upper.value;
  
  document.getElementById('lwYearNum').innerText = l + "年";
  document.getElementById('upYearNum').innerText = u + "年";
  
  const upy = Math.max(l,u);
  const lwy = Math.min(l,u);
  console.log(upy, lwy);
  
  const filterArr = [
          ['>=', ["to-number", ["slice", ["get", "date"], 0, 4]], lwy],
          ['<=', ["to-number", ["slice", ["get", "date"], 0, 4]], upy]
          
  ];
  
  
  //縮尺で絞り込み
  const ps1 = +document.question.pscalestart.value;
  const ps2 = +document.question.pscaleend.value;
  const pscalestart = Math.min(ps1, ps2);
  const pscaleend = Math.max(ps1, ps2);
  if(true){
    filterArr.push( [">=", ["get", "scale"], pscalestart] );
    filterArr.push( ["<=", ["get", "scale"], pscaleend] );
  }
  
  
  //カラー種別で絞り込み
  const pcolor = document.question.pcolor.value;
  if(pcolor == "c"){
    filterArr.push( [ 
      "all",
      // ["has", "color"],
      ["==", ["get", "color"], "カラー"] 
    ] );
  }else if(pcolor == "m"){
    filterArr.push( [ 
      "any",
      ["!", ["has", "color"]],
      ["==", ["get", "color"], "モノクロ"] 
    ] );
  }
  
  
  console.log(filterArr);
  const filterArrTest = [];
  showLayer(tile, upy, lwy, filterArr);
}



//HTMLのボタンクリック時
// - 共通部分の操作時
refleshAll =() => {
  refleshLayer('photo');
  refleshLayer('photo2');
  refleshLayer('photo3');
}

// - 各レイヤのボタン操作時
const refleshPp = () =>{
  refleshLayer('photo');
}
const refleshPp2 = () =>{
  refleshLayer('photo2');
}
const refleshPp3 = () =>{
  refleshLayer('photo3');
}



//Map読み込み時
map.on('load', function(){
  map.addLayer({
			"metadata": {
			  "desc": "クリックした地物の強調用レイヤ挿入用"
			}
			"id": "overlap",
			"type": "background",
			"layout": {
				"visibility": "visible"
			},
			"paint": {
				"background-color": "rgba(255,255,255,0)",
				"background-opacity": 0
			}
  });
  
  refleshAll();
});

