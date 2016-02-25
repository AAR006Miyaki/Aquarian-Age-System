var interval_id = null ;
var interval_cnt = 0 ;


function get_position(obj,i){ return (obj ? (Number.isNaN(Number(obj.substr(1))) ? (Number.isNaN(Number(i)) ? 0 : Number(i)-1) : (Number(obj.substr(1)) + (Number.isNaN(Number(i)) ? 0 : Number(i)))) : 0); }//パワーカードの位置情報を返す

function make_area(obj,i) { return 'area' + (obj ? Number(obj.substr(4))+i : i ); }//エリア名称を返す

function close_action(){
	document.getElementById("Action").classList.add('d_none');
	var ele = document.getElementsByClassName('selected');
	while(ele.length){ele[0].classList.remove('selected')}
}//行動選択ウィンドウの非表示化

function skill_count(obj,skill){//引数はcardオブジェクト,スキル名の文字列
	if(obj){
		if(obj.hasOwnProperty('Param')){
			if(obj['Param'].hasOwnProperty('Skill')){
				if(obj['Param']['Skill'].hasOwnProperty(skill)){
					if(Array.isArray(obj['Param']['Skill'][skill])){
						if(skill == 'Boost'){return Math.max.apply(null, obj['Param']['Skill'][skill]);}//ブーストの場合X以下OKなので最大値
						if(skill == 'Bind'){return Math.min.apply(null, obj['Param']['Skill'][skill]);}//バインド（一応、最小値を返してるけどどうするべきか・・・）
						var cnt = 0 ; for(var i=0,l=obj['Param']['Skill'][skill].length;i<l;i+=1){cnt += Number(obj['Param']['Skill'][skill][i]) ;}
						return cnt;//それ以外は合計値（ドロー・チャージ・パーマネント・キャパシティ・リムーブ）
					}//
					if(Number.isInteger(obj['Param']['Skill'][skill])){ return Number(obj['Param']['Skill'][skill]);}//上記を除く特に追加情報を持たないスキル全般
					//それ以外はオブジェクトなので個別処理　多分、プレテクト・レジスト・サーチ系だけのはず
					//return obj.skill //現状は未実装
				}//当該スキル持っている
			}//対象がスキルを持っていない
		}//対象がパラメータ持っていない
	}//対象が存在する
	return 0 ;//当該スキルを持っていない
}//スキルカウントの本体

function skill_check(obj,skill){//引数はエリアもしくは、キャラクター,スキル名の文字列
//改善の余地あり
								var cnt = 0 ;
								if(Array.isArray(obj[e_char_def.characters])){
									switch(obj){
										case territory1 ://このブロックはわざとbreakしてない
										case territory2 :
											for(var i=0,l=obj[e_area.Control].length;i<l;i+=1){ cnt += skill_count(obj[e_area.Control][i][e_char_def.characters],skill) ; }//支配エリアをカウント
											for(var i=0,l=obj[e_area.Force].length;i<l;i+=1){
												for(var j=0,k=obj[e_area.Force][i].length;j<k;j+=1){ cnt += skill_count(obj[e_area.Force][i][j][e_char_def.characters],skill) ; }
											}//勢力エリアをカウント
											break ;
										case force_a1 ://このブロックはわざとbreakしてない
										case force_a2 :
											for(var i=0,l=obj.length;i<l;i+=1){
												for(var j=0,k=obj[i].length;j<k;j+=1){ cnt += skill_count(obj[i][j][e_char_def.characters],skill) ; }
											}//勢力エリアをカウント
											break ;
										default :{
											for(var i=0,l=obj.length;i<l;i+=1){ cnt += skill_count(obj[i][e_char_def.characters],skill) ; }
											break ;}//その他エリア（支配エリア）をカウント
									}//指定されたエリアにいるキャラクターの指定されたスキルの数を返す
								}//対象がエリアor単体
								else{ cnt = skill_count(obj[e_char_def.characters],skill) ; }//指定されたキャラクターの指定されたスキルの数を返す
								return cnt ;
//改善の余地あり
}//スキル有無・数のチェックojbはキャラクターかエリア

function card_open(obj){//引数はcardオブジェクト
	var idx = obj.length - 1 ;
	var ele_d = document.createElement('div');
	ele_d.className = 'area' + idx;
	var ele_i = document.createElement('img');
	ele_i.className = 'card' ;
	ele_i.src ='./Image/Saga3/aq3' + ('000' + obj[idx].No.Num).slice(-4) + '.jpg';
	ele_i.setAttribute('onClick','popUp(event,this)') ;
	ele_d.appendChild(ele_i);
	return ele_d ;
}//非公開カードの公開処理

function drow(event,obj){//ドローのクリックイベント受取り用
	DrowFlag = false ;
	for(var i=DrawCount;i>0;i--){
	if(game[PlayerNo-1][e_area.Deck].length){
		game[PlayerNo-1][e_area.Hand].push(game[PlayerNo-1][e_area.Deck].pop());
		var ele_h = document.getElementById("Hand_A2");
		var ele_d = card_open(game[PlayerNo-1][e_area.Hand]);//要素の作成
		ele_h.appendChild(ele_d);//最後の子要素として追加
	}//デッキにカードがある
		else {alert("ドローできません");}
	}//1枚ずつドロー
	close_action() ;
	event.stopPropagation(); return false;
}//ドロー処理

function set(event,obj) {
	var ele_a = document.getElementsByClassName('selected');
	ele_a = ele_a[0].parentNode ;
	var idx = Number(ele_a.className.substr(4)) ;

	var Playing = {} ; Playing[ResponseCount] = game[PlayerNo-1][e_area.Hand].splice(idx,1)[0] ;
	game[PlayerNo-1][e_area.Play].push(Playing);
	console.log(game[PlayerNo-1][e_area.Play]) ;
	switch(Playing[ResponseCount].Type){
		case e_ctype.character: {break;}//対象選択不要
		case e_ctype.breakcard://このブロックはわざとbreakしてない
		case e_ctype.parmanent://このブロックはわざとbreakしてない
		case e_ctype.project://このブロックはわざとbreakしてない
		case e_ctype.fast:
			ResponseCount += 0.25;
			break ;//対象選択が必要
		default: {break;}
	}//カードタイプ別処理
	ResponseCount +=1 ;

	var ele_p = document.getElementById("Play_A2").firstElementChild;//Play_Bの取得
	var ele= ele_p.getElementsByClassName("g_top") ;
	if(ele.length){
		ele[0].classList.remove('g_top');
	}//最新を外す
    
	switch(Playing[Math.round(ResponseCount-1)].Type){
		case e_ctype.character:{ele_a.firstElementChild.className = 'ch_card'; break;}//キャラクターカード
		case e_ctype.breakcard:{ele_a.firstElementChild.className = 'br_card'; break;}//ブレイクカード
		case e_ctype.parmanent:{ele_a.firstElementChild.className = 'pa_card'; break;}//パーマネントカード
		case e_ctype.project:{ele_a.firstElementChild.className = 'pr_card'; break;}//プロジェクトカード
		case e_ctype.fast:{ele_a.firstElementChild.className = 'fa_card'; break;}//ファストーカード
		default: {ele_a.firstElementChild.className = 'un_card'; break;}//不明なカード
	}//カードタイプの設定
	ele_a.className = 'c_set';
	ele_a.classList.add('p' + Math.round(ResponseCount-1));
	ele_a.classList.add('g_top');

	var ele_s = ele_p.lastElementChild.previousElementSibling//arrowFLの取得
	ele_p.insertBefore(ele_a,ele_s);

	var ele_d = document.getElementById("Hand_A2").childNodes;
	var cnt = ele_d.length;
	for(;idx<cnt;idx+=1){ ele_d[idx].className = 'area' + (idx-1); }//手札の空きを詰める

	close_action() ;
	event.stopPropagation(); return false;
}//セット処理

function play(event,obj) {
	set(event,obj) ;//処理の実態はsetに実装
	//close_action() ;//set側で処理しているのでいらない
	event.stopPropagation(); return false;
}//プレイ処理

function attack(event,obj){
	var target = [] ;
	var area = [] ;
	var position = 0 ;
	var ele_attak = document.getElementsByClassName('Attacker') ;
	if(ele_attak[0].parentNode.classList.contains('Control_A')){
		area = game[PlayerNo-1][e_area.Territory][e_area.Control] ;
		position = ele_attak[0].classList.item(1).substr(4);
	}//支配エリア
	else{
		area = game[PlayerNo-1][e_area.Territory][e_area.Force][ele_attak[0].parentNode.classList.item(1).substr(4)] ;
		position = ele_attak[0].classList.item(1).substr(1);
		target = game[PlayerNo-1] ;
	}//勢力エリア
	var Playing = {} ; 
	Playing[ResponseCount] = Object.assign({},area[position][e_char_def.characters]) ;
	Playing[ResponseCount].Type = 'Attack';
	Playing[ResponseCount].Area = area;
	Playing[ResponseCount].Position = position;
	Playing[ResponseCount].Target = target;
	Playing[ResponseCount].Cost = 1;
	if(!Playing[ResponseCount].Target.length){
		ResponseCount += 0.25;//対象選択へ
	}
	play2.push(Playing);//アタック宣言
	console.log(Playing[Math.round(ResponseCount)]['Param']['Name']['Class'] + "が" + target + "にアタック宣言しました") ;
	ResponseCount+=1;

	close_action() ;
	event.stopPropagation(); return false;
}//アタック宣言処理
function guard(event,obj){
	var target = [] ;
	var area = [] ;
	var position = 0 ;
	var ele_guard = document.getElementsByClassName('Guarder') ;
	if(ele_guard[0].parentNode.classList.contains('Control_A')){
		area = game[PlayerNo-1][e_area.Territory][e_area.Control] ;
		position = ele_guard[0].classList.item(1).substr(4);
	}//支配エリア
	else{
		area = game[PlayerNo-1][e_area.Territory][e_area.Force][ele_guard[0].parentNode.classList.item(1).substr(4)] ;
		position = ele_guard[0].classList.item(1).substr(1);
	}//勢力エリア
	var Playing = {} ;
	Playing[ResponseCount] = Object.assign({},area[position][e_char_def.characters]) ;
	Playing[ResponseCount].Type = 'Guard';
	Playing[ResponseCount].Area = area;
	Playing[ResponseCount].Position = position;
	Playing[ResponseCount].Cost = 1;//ガードコスト・インセプ持ちならその分減算
	play2.push(Playing);//アタック宣言
	console.log(Playing[ResponseCount]['Param']['Name']['Class'] + "がガード宣言しました") ;
	if(ele_guard[0].parentNode.classList.contains('Control_A')){
		ResponseCount+=0.75;
	}
	else{ ResponseCount+=1; }

	close_action() ;
	event.stopPropagation(); return false;
}//ガード宣言処理
function select_target(event,ojb){
	var ResCnt = Math.round(ResponseCount) ;
	var playing = {} ;
	var play = game[PlayerNo-1][e_area.Play] ;
	var l = play.length-1 ;
	do{ playing = play[l][l--]; }while(playing.hasOwnProperty(ResCnt-1)) ;//プレイ中のカード情報の取得
		
	if(playing.hasOwnProperty('Target') && !playing.Target.lenght){
		var ele_target = document.getElementsByClassName('Target') ;
		if(ele_target[0].id.substr(0,6) == 'Player'){
			playing.Target = game[PlayerNo-1] ;
		}//プレイヤー対象
		else{
			var idx = ele_target[0].parentNode.classList.item(1).substr(4) ;
			var ele_area = document.getElementById('Force_A2').getElementsByTagName('div') ;
			console.log(ele_area) ;
			ele_target[0].classList.add('Guarder') ;
			playing.Target = game[PlayerNo-1][e_area.Territory][e_area.Force][idx] ;
		}//勢力エリア対象
	}//アタック対象未選択
	ResponseCount -= 0.5 ;

	close_action() ;
	event.stopPropagation(); return false;
}//対象の選択
function pay_cost(event,obj){
	ResponseCount = Math.ceil(ResponseCount) ;

	var ele = document.getElementsByClassName('Pay') ;
	var ele_d = document.getElementById("Discard_A2").firstElementChild;//Discard_Bの取得
	var ele_s = ele_d.lastElementChild.previousElementSibling ;//Discard_BのarrowFLを取得
	while(ele.length){
		var idx = ele[0].parentNode.classList.item(1).substr(4) ;
		var idx2 = ele[0].classList.item(1).substr(1) ;

		discard2.push(control_a2[idx][e_char_def.setcard][e_char_def.power_g].splice(idx2,1)[0]);
		discard2[discard2.length-1].Type *= -1 ;

		ele[0].src ='./Image/Saga3/aq3' + ('000' + discard2[discard2.length -1].No.Num).slice(-4) + '.jpg';
		var ele_c = document.createElement('div') ;
		ele_c.className = 'dis';
		ele_c.classList.add('p' + (discard2.length-1));
		ele_c.classList.add('g_top');

		var ele_p = ele[0].parentNode.getElementsByClassName('pw_card');
		for(var i = ele_p.length-1,l=i;i>idx2-1;i-=1){
			if(!ele_p[l-i].classList.contains('Pay')){
			    ele_p[l-i].className = ele_p[l-i].classList.item(0) + ' u' + (ele_p[l-i].classList.item(1).substr(1)-1) ;
			}//支払うパワーカードではない
		}//パワーカードのスライド

		ele_d.insertBefore(ele_c,ele_s);
		ele_c.appendChild(ele[0]);
		ele[ele.length-1].className = 'card';//要素を移動させたので位置が最初から最後に代わっている
		if(ele_s.previousElementSibling.previousElementSibling){
			ele_s.previousElementSibling.previousElementSibling.classList.remove('g_top');
		}//最新を外す
	}//コスト指定されたカードがある


	var playing = {} ;
	var play = game[PlayerNo-1][e_area.Play] ;
	var l = play.length-1 ;
	do{ playing = play[l][l--]; }while(playing.hasOwnProperty(ResponseCount-1)) ;//プレイ中のカード情報の取得
	switch(playing.Type){
		case 'Attack' :{
			var ele_target = document.getElementsByClassName('Target') ;
			if(ele_target[0].id.substr(0,6) != 'Player'){
				var evt = document.createEvent("MouseEvents");
				evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				guard(evt,document.getElementById('Game')) ;
			}//勢力エリア対象
			break;}//直前の宣言がアタックの場合
	}

	close_action() ;
	event.stopPropagation(); return false;
}//コストの支払い処理
function set_power(event,obj) { }//今のところ意味なし
function response_end(event,obj) {
	var Playing = [] ;
	var Guardian = {} ;
	while(play1.length){Playing.push(play1.pop());}
	while(play2.length){Playing.push(play2.pop());}
	Playing.sort(function(a,b){return (Object.keys(a)[0] > Object.keys(b)[0] ? 1 : -1);});//注：ソート未検証
	while(Playing.length){
		ResponseCount -=1
		var processing = Playing.pop()[ResponseCount];
		console.log('processing' ,ResponseCount, processing);
		switch(processing.Type){
			case e_ctype.character:{
				console.log("character");

				var character_g = new Array(); character_g.push(processing); var break_g = new Array();
				var parmanent_g = new Array(); var power_g = new Array();
				var character = [break_g,character_g]; var setcard = [parmanent_g,power_g];var character_s = [Object.assign({},processing),character,setcard];
				console.log(character_s);//キャラクターデータの作成

				var g_name = "Non_A2"; var a_name = n_a2;
				if("Era" in processing.Force) { g_name = "Era_A2" ; a_name = er_a2; }
				if("Kyo" in processing.Force) { g_name = "Kyo_A2" ; a_name = k_a2; }
				if("Dar" in processing.Force) { g_name = "Dar_A2" ; a_name = d_a2; }
				if("Wiz" in processing.Force) { g_name = "WIZ_A2" ; a_name = w_a2; }
				if("Ara" in processing.Force) { g_name = "ARA_A2" ; a_name = a_a2; }
				if("Ego" in processing.Force) { g_name = "EGO_A2" ; a_name = e_a2; }
				a_name.push(character_s) ;
				console.log(a_name);//セット対象エリアの選定

				var ele_p = document.getElementById("Play_A2").firstElementChild;//Play_Bの取得;
				var ele_t = document.getElementById(g_name);
				var ele_ps = ele_p.lastElementChild.previousElementSibling ;//arrowFLの取得
				var ele_ts = ele_t.lastElementChild.previousElementSibling ;//arrowFLの取得

				var ele = ele_t.getElementsByClassName("g_top");
				if(ele.length){
					ele[0].classList.remove('g_top');
				}//勢力トップの変更

				ele_ps.parentNode.firstElementChild.firstElementChild.className = ele_ps.parentNode.firstElementChild.firstElementChild.classList.item(0) + ' p0';
				if(ele_ts.previousElementSibling){
					var ele_pss = ele_ps.previousElementSibling;
					var ele_tss = ele_ts.previousElementSibling;
					ele_pss.className = ele_tss.classList.item(0) + ' p' + (Number(ele_tss.classList.item(1).substr(1)) +1) + ' g_top';
				}//先にセットされているキャラクターがあれば位置情報を更新
				ele_t.insertBefore(ele_ps.previousElementSibling,ele_ts);
				if(ele_ps.previousElementSibling){
					ele_ps.previousElementSibling.classList.add('g_top');
				}//解決待ちトップの変更
				break; }//キャラクターカードの処理
			case e_ctype.breakcard :{
				console.log("Break");

				var ele = document.getElementsByClassName('Target') ;
				var idx = Number(ele[0].parentNode.parentNode.id.substr(-1)) ;//プレイヤーナンバーを取得
				var idx2 = ele[0].classList.item(1).substr(1) ;
				var a_name = [];
				var g_name = ele[0].parentNode.id ;
				switch(g_name){
					case 'EGO_A1' : {a_name = e_a1; break; }
					case 'EGO_A2' : {a_name = e_a2; break; }
					case 'ARA_A1' : {a_name = a_a1; break; }
					case 'ARA_A2' : {a_name = a_a2; break; }
					case 'WIZ_A1' : {a_name = w_a1; break; }
					case 'WIZ_A2' : {a_name = w_a2; break; }
					case 'Dar_A1' : {a_name = d_a1; break; }
					case 'Dar_A2' : {a_name = d_a2; break; }
					case 'Kyo_A1' : {a_name = k_a1; break; }
					case 'Kyo_A2' : {a_name = k_a2; break; }
					case 'Era_A1' : {a_name = er_a1; break; }
					case 'Era_A2' : {a_name = er_a2; break; }
					case 'Non_A1' : {a_name = n_a1; break; }
					case 'Non_A2' : {a_name = n_a2; break; }
					default : {
						idx2 = Number(ele[0].classList.item(1).substr(4)) ;//支配エリア内での位置情報の取得
						switch(g_name){
							case 'Control_A1' : { a_name = control_a1; break; }
							case 'Control_A2' : { a_name = control_a2; break; }
							default : { break ; }
						}
						break ; }//支配エリアの場合
				}//エリア情報の取得
				if(idx2<0){
				}//勢力エリアの場合、勢力エリアでの位置情報を取得
				console.log('対象プレイヤー',idx,'ターンプレイヤー',PlayerNo,'対象のエリア内位置',idx2,'対象のエリア',g_name,'対象のエリア状況',a_name) ;
				if(idx != PlayerNo){
					var character_g = new Array(); var break_g = new Array(); break_g.push(processing);
					var parmanent_g = new Array(); var power_g = new Array();
					var character = [break_g,character_g]; var setcard = [parmanent_g,power_g];var character_s = [Object.assign({},processing),character,setcard];
					console.log(character_s);//キャラクターデータの作成
					control_a2.push(character_s) ;
					/*他のプレイヤー実装時にキャラクターの捨て札処理を追加する*/
				}//他のプレイヤーのテリトリーのキャラクターの場合
				else{
					if(a_name !== control_a2){
						control_a2.push(a_name.splice(idx2,1)[0]) ;
						idx2 = control_a2.length - 1 ;
					}//支配エリアでなければ支配エリアに移動
					control_a2[idx2][e_char_def.characters] = Object.assign({},processing) ;
					control_a2[idx2][e_char_def.character][e_char_def.break_g].push(processing) ;
					console.log(control_a2);//セット対象エリアの選定
					}//自分のテリトリーのキャラクターの場合

					var ele_p = document.getElementById("Play_A2").firstElementChild;//Play_Bの取得;
					var ele_ps = ele_p.lastElementChild.previousElementSibling ;//arrowFLの取得
					var ele_b = ele[0] ;
					ele[0].appendChild(ele_ps.previousElementSibling.firstElementChild);
					ele_p.removeChild(ele_ps.previousElementSibling);
					if(a_name != control_a2){
					if(idx == PlayerNo){
						var ele_c = ele[0].parentNode.getElementsByClassName("c_set");
						var ele_a = document.getElementById("Control_A2") ;
						ele_a.appendChild(ele[0]) ;
						var ele_d = ele_a.lastElementChild ;
						ele_d.className = 'c_set area' + (control_a2.length-1) ;
						if(a_name.length){
							for(var i=0,l=ele_c.length;i<l;i+=1){
								ele_c[i].className = ele_c[i].classList.item(0) + ' p' + Number(i) ;
							}
							ele_c[ele_c.length-1].classList.add('g_top');
						}//勢力キャラクターの位置詰め
					}//自分の勢力エリアのキャラクターの場合
				}//自分の支配エリア以外の場合
				var ele_b = ele_b.lastElementChild ;
				ele_b.className = ele_b.classList.item(0) + ' p0';
				if(ele_b.previousElementSibling && ele_b.previousElementSibling.classList.contains('br_card')){
					ele_b.className = ele_b.classList.item(0) + ' p' + (Number(ele_b.previousElementSibling.classList.item(1).substr(1)) +1);
				}//先にセットされているブレイクがあれば位置情報を更新

				if(ele_ps.previousElementSibling != null){
					ele_ps.previousElementSibling.classList.add('g_top');
				}//解決待ちトップの変更
				while(ele.length){ele[0].classList.remove('Target');} //Targetの解除

				break; }//ブレイクカードの処理
			case 'Attack' :{
				console.log("Attack");
				if(!Object.keys(Guardian).length){//条件ガードされていないに変更
					damege(event,player2,processing['Param']['Attack']);
				}//バトルが成立していない
				else{
					console.log("Battle");
					if(processing['Param']['Attack'] >= Guardian['Param']['Difense']){
						var ele_Guarder = document.getElementsByClassName('Guarder') ;
						var ele_Discard = document.getElementById("Discard_A2").firstElementChild;//Discard_Bの取得
						var ele_arrowFL = ele_Discard.lastElementChild.previousElementSibling ;//Discard_BのarrowFLを取得
						var ele_Cards = ele_Guarder[0].getElementsByClassName('pw_card');
						for(var i=ele_Cards.length-1;i>=0;i-=1){
							ele_Cards[i].src ='./Image/Saga3/aq3' + ('000' + Guardian['Area'][Guardian['Position']][e_char_def.setcard][e_char_def.power_g][i].No.Num).slice(-4) + '.jpg';
						}//画像の切り替えパワーカード⇒通常カード

						var chr = Guardian['Area'].splice(Guardian['Position'],1)[0] ;
						while(chr[e_char_def.character][e_char_def.break_g].length){ discard2.push(chr[e_char_def.character][e_char_def.break_g].pop()); }
						while(chr[e_char_def.character][e_char_def.character_g].length){ discard2.push(chr[e_char_def.character][e_char_def.character_g].pop()); }
						while(chr[e_char_def.setcard][e_char_def.parmanent_g].length){ discard2.push(chr[e_char_def.setcard][e_char_def.parmanent_g].pop()); }
						while(chr[e_char_def.setcard][e_char_def.power_g].length){
							discard2.push(chr[e_char_def.setcard][e_char_def.power_g].pop());
							discard2[discard2.length-1].Type *= -1;
						}//パワーカード⇒通常カード変換

						while(ele_Guarder[0].childNodes.length){
							var ele_Card = ele_Guarder[0].lastElementChild;
							ele_Card.className = 'card';
							var ele_c = document.createElement('div') ;
							ele_c.className = 'dis';
							if(ele_arrowFL.previousElementSibling){
								ele_c.classList.add('p' + (Number(ele_arrowFL.previousElementSibling.classList.item(1).substr(1))+1));
							}
							else{ ele_c.classList.add('p0'); }
							ele_c.classList.add('g_top');


							ele_c.appendChild(ele_Card);
							ele_Discard.insertBefore(ele_c,ele_arrowFL);
							if(ele_arrowFL.previousElementSibling.previousElementSibling){
								ele_arrowFL.previousElementSibling.previousElementSibling.classList.remove('g_top');
							}//最新を外す
						}
						var ele_Area = ele_Guarder[0].parentNode ;
						ele_Area.removeChild(ele_Guarder[0]);
						var ele_Area_div = ele_Area.getElementsByTagName('div');
						var p_text = 'c_set area' ;
						if(ele_Area.id != 'Control_A2'){
							p_text = 'c_set p' ;
						}
						for(var i=0,l=ele_Area_div.length;i<l;i+=1){
							ele_Area_div[i].className = p_text + i ;
							ele_Area_div[i].classList.remove('g_top') ;
						}//エリアの位置詰処理
						if(ele_Area.id != 'Control_A2'){
							if(ele_Area_div.length){
								ele_Area_div[ele_Area_div.length-1].classList.add('g_top') ;
							}
						}
					}//アタック⇒ガード判定
					if(Guardian['Param']['Attack'] >= processing['Param']['Difense']){
						var ele_Attacker = document.getElementsByClassName('Attacker') ;
						var ele_Discard = document.getElementById("Discard_A2").firstElementChild;//Discard_Bの取得
						var ele_arrowFL = ele_Discard.lastElementChild.previousElementSibling ;//Discard_BのarrowFLを取得
						var ele_Cards = ele_Attacker[0].getElementsByClassName('pw_card');
						for(var i=ele_Cards.length-1;i>=0;i-=1){
							ele_Cards[i].src ='./Image/Saga3/aq3' + ('000' + processing['Area'][processing['Position']][e_char_def.setcard][e_char_def.power_g][i].No.Num).slice(-4) + '.jpg';
						}//画像の切り替えパワーカード⇒通常カード

						var chr = processing['Area'].splice(processing['Position'],1)[0] ;

						while(chr[e_char_def.character][e_char_def.break_g].length){ discard2.push(chr[e_char_def.character][e_char_def.break_g].pop()); }
						while(chr[e_char_def.character][e_char_def.character_g].length){ discard2.push(chr[e_char_def.character][e_char_def.character_g].pop()); }
						while(chr[e_char_def.setcard][e_char_def.parmanent_g].length){ discard2.push(chr[e_char_def.setcard][e_char_def.parmanent_g].pop()); }
						while(chr[e_char_def.setcard][e_char_def.power_g].length){
							discard2.push(chr[e_char_def.setcard][e_char_def.power_g].pop());
							discard2[discard2.length-1].Type *= -1;
						}//パワーカード⇒通常カード変換

						while(ele_Attacker[0].childNodes.length){
							var ele_Card = ele_Attacker[0].lastElementChild;
							ele_Card.className = 'card';
							var ele_c = document.createElement('div') ;
							ele_c.className = 'dis';
							if(ele_arrowFL.previousElementSibling){
								ele_c.classList.add('p' + (Number(ele_arrowFL.previousElementSibling.classList.item(1).substr(1))+1));
							}
							else{ ele_c.classList.add('p0'); }
							ele_c.classList.add('g_top');

							ele_c.appendChild(ele_Card);
							ele_Discard.insertBefore(ele_c,ele_arrowFL);
							if(ele_arrowFL.previousElementSibling.previousElementSibling){
								ele_arrowFL.previousElementSibling.previousElementSibling.classList.remove('g_top');
							}//最新を外す
						}
						var ele_Area = ele_Attacker[0].parentNode ;
						ele_Area.removeChild(ele_Attacker[0]);
						var ele_Area_div = ele_Area.getElementsByTagName('div');
						var p_text = 'c_set area' ;
						if(ele_Area.id != 'Control_A2'){
							p_text = 'c_set p' ;
						}
						for(var i=0,l=ele_Area_div.length;i<l;i+=1){
							ele_Area_div[i].className = p_text + i ;
							ele_Area_div[i].classList.remove('g_top') ;
						}//エリアの位置詰処理
						if(ele_Area.id != 'Control_A2'){
							if(ele_Area_div.length){
								ele_Area_div[ele_Area_div.length-1].classList.add('g_top') ;
							}
						}
					}//ガード⇒アタック判定
				}//バトルが成立している
				break;}//アタック解決時の処理
			case 'Guard' :{
				console.log("Guard");
				Guardian = processing ;
				break; }//ガード解決時の処理
			case 'Battle' :{ break; }//バトル解決時の処理
			default:{ break; }
		}
		console.log('解決したカード',processing);
		console.log('未解決のカード',Playing);
		console.log('解決後の対象エリアの状況',a_name);
	}
	var ele = document.getElementsByClassName('Target') ; while(ele.length){ele[0].classList.remove('Target');}
	ele = document.getElementsByClassName('Attacker') ; while(ele.length){ele[0].classList.remove('Attacker');}
	var ele = document.getElementsByClassName('Guarder') ; while(ele.length){ele[0].classList.remove('Guarder');}
	close_action() ;
	event.stopPropagation(); return false;
}//レスポンスの解決処理
function damege(event,obj,value){
	interval_cnt = value ;
	interval_id = setInterval(function(){
		var ele_a = card_open(obj[e_area.Deck]) ;//Play領域が特殊なので先に公開時の表示情報を取得しておく
		var check = obj[e_area.Deck].pop() ;
		if(check && obj[e_area.Damege].length < Damege_Max){
			console.log(check);
			switch(check.Type){
				case e_ctype.character :{
					var Playing = {} ; Playing[ResponseCount] = check ;
					play2.push(Playing);
					ResponseCount+=1 ;

					var ele_p = document.getElementById("Play_A2").firstElementChild;//Play_Bの取得
					var ele= ele_p.getElementsByClassName("g_top") ;
					if(ele.length){
						ele[0].classList.remove('g_top');
					}//最新を外す
					ele_a.firstElementChild.className = 'ch_card';
					ele_a.className = 'c_set';
					ele_a.classList.add('p' + Math.round(ResponseCount-1));
					ele_a.classList.add('g_top');
					var ele_s = ele_p.lastElementChild.previousElementSibling//arrowFLの取得
					ele_p.insertBefore(ele_a,ele_s);
					console.log(ele_p) ;
					response_end(event,obj) ;
					break ; }//キャラクターは勢力エリアにセットされる
				default :{
					damege2.push(check) ;

					var ele_d =  card_open(obj[e_area.Damege]) ;
					var ele_p = document.getElementById("Damege_A2");
					ele_p.appendChild(ele_d);
					break; }//それ以外はダメージ置き場へ
			}//カードタイプ毎の処理
		}//デッキにカードが残っているかダメージ上限でない
		if(obj[e_area.Damege].length >= Damege_Max){
			alert("ダメージが上限に達しました。");
			clearInterval(interval_id);
			interval_id = null ;
		}
		if(--interval_cnt == 0){clearInterval(interval_id); interval_id = null ;}
	},500) ;//受けた数値分処理を繰り返す
}//ダメージ判定

function force_check(event,obj) {
	if(force_a2[ForceCount].length){
		if(skill_check(force_a2[ForceCount][force_a2[ForceCount].length-1],'Aggressive')){
			var ele_force = document.getElementById('Force_A2').children ;
			console.log(ele_force) ;
			var ele_force_g = ele_force[ForceCount] ;
			console.log(ele_force_g) ;
			ele_force_g.lastElementChild.previousElementSibling.previousElementSibling.classList.add('Attacker') ;
			document.getElementById('Player2').classList.add('Target') ;
			attack(event,obj) ;
		}//▼有り
	}//勢力エリアにキャラクターがいる
	ForceCount += 1 ;
	document.getElementById("forcecheck").innerHTML = Force_Name[ForceCount] + "勢力チェック" ;

	close_action() ;
	event.stopPropagation(); return false;
}//勢力グループのアグレッシブチェック
function phase_start(event,obj) {
	PhaseStart= true ;

    close_action() ;
    event.stopPropagation(); return false;
}//フェイズ開始時の処理
function phase_end(event,obj) {
	PhaseStart= false ;
	var p_text = "フェイズ";
	switch(++PhaseCount){
		case e_phase.Drow:{
			DrowFlag = true ;
			DrawCount = 1 + skill_check(game[PlayerNo-1][e_area.Territory][e_area.Control],'Draw') ;//ドロー数の決定
			console.log('ドロー数は',DrawCount) ;
			//skill_check(game[i][e_area.Territory][e_area.Control],skill) ;//リムーブ数の決定（スキル未実装につきコメントアウト中）
			p_text = "ドロー" + p_text ;
			break ; }//ターン終了時の処理
		case e_phase.Aggressive:{
			ForceCount = 0 ;
			document.getElementById("forcecheck").innerHTML = Force_Name[ForceCount] + "勢力チェック" ;
			p_text = "勢力" + p_text ;
			break ; }//ドローフェイズ終了時の処理
		case e_phase.Main:{
			p_text = "メイン" + p_text ;
			break ; }//勢力フェイズ終了時の処理
		case e_phase.Power:{
			ChargeCount = skill_check(game[PlayerNo-1][e_area.Territory][e_area.Control],'Charge') ;//チャージ数の決定
			console.log('チャージ数は',ChargeCount) ;
			p_text = "パワーカード" + p_text ;
			break ; }//メインフェイズ終了時の処理
		case e_phase.Discard:{
			var darray = new Array();
			var area_array = [] ;
			area_array.push(game[PlayerNo-1][e_area.Territory][e_area.Control]) ;
			area_array.push.apply(area_array,game[PlayerNo-1][e_area.Territory][e_area.Force]);
			area_array.forEach(function(e){
				e.forEach(function(e2){
					e2[e_char_def.setcard][e_char_def.power_g].forEach(function(e3){
						if(e3.hasOwnProperty('Date')){ darray.push(e3) ; }
					});
				});
			});//仮に入れておいたパワーカードの収集
			darray.sort(function(a,b) { return (a.Date > b.Date ? 1 : -1); });//セットされたのが古い順にソート
			for (key1 in darray){
				var card_d = deck2.pop() ;
				card_d.Type *= -1 ;
				for(key2 in card_d){
					Object.defineProperty(darray[key1],key2,{value :card_d[key2],writable : true,enumerable : true,configurable : true}) ;
				}//デッキトップの情報で仮情報をアップデート
				delete darray[key1].Date ;
			}//仮パワーカードを正規のパワーカードへ
            
			var ele = document.getElementById('Player2').getElementsByClassName('pw_card') ;
			console.log(ele);
			for(var i=0;i<ele.length;i++){
				if( ele[i].classList.item(1).match(/[io]/)){
					console.log(ele[i].classList);
					if(ele[i].classList.item(1).charAt(0)== 'o'){
						ele[i].src = "./Image//Saga3/card_power.gif";
					}//裏面画像へ
					if(ele[i].parentNode.firstChild.classList.contains('pw_card')){
						ele[i].className = ele[i].classList.item(0) + ' u' + (Number(ele[i].parentNode.firstChild.classList.item(1).substr(1))+1) ;
					}
					else{
						ele[i].className = ele[i].classList.item(0) + ' u' + (Number(ele[i].classList.item(1).substr(1))) ;
					}
					ele[i].parentNode.insertBefore(ele[i], ele[i].parentNode.firstChild);
				}//このターンセットしたパワーカード
			}//パワーカードをキャラクターの下へ移動
            
			game[PlayerNo-1][e_area.Territory][e_area.Force].forEach(function(e,i){
				if(e.length){
					if(e[e.length-1][e_char_def.setcard][e_char_def.power_g].length == e[e.length-1][e_char_def.characters].Param.Mind){
						game[PlayerNo-1][e_area.Territory][e_area.Control].push(e.pop()) ;

						var sel = sel_Array[PlayerNo-1][i] ;
						ele_c = document.getElementById(sel).getElementsByClassName('c_set') ;
						if(ele_c.length){
							ele_c[ele_c.length-1].className = 'c_set area' + (control_a2.length-1) ;
							document.getElementById('Control_A2').appendChild(ele_c[ele_c.length-1]) ;
						}//支配エリアに移動
						if(ele_c.length){ ele_c[ele_c.length-1].classList.add('g_top') ; }//アクティブキャラクターの変更
					}//支配できれば支配処理
				}//勢力グループにキャラクターがいる
			});//勢力グループ全てをチェック
			Hand_Max = 7 + skill_check(game[PlayerNo-1][e_area.Territory][e_area.Control],'Capacity') ;//キャパシティ数の決定
			if(Hand_Max < hand2.length){ DiscardFlag = true ; }//手札調整が必要か
			console.log('手札上限は',Hand_Max) ;
			p_text = "ディスカード" + p_text ;
			break ; }//パワーカードフェイズ終了時の処理
        default :{
			var ele_d = document.getElementById("Discard_A2").firstElementChild;
			var ele_s = ele_d.lastElementChild.previousElementSibling ;
			var ele = document.getElementsByClassName('dr_card');
			while(ele.length){
				console.log(ele) ;
				var idx = ele[0].parentNode.className.substr(4) ;
				console.log('手札位置',idx) ;
				game[PlayerNo-1][e_area.Discard].push(game[PlayerNo-1][e_area.Hand].splice(idx,1)[0]) ;

				ele[0].parentNode.className = 'dis p' + (game[PlayerNo-1][e_area.Discard].length ? game[PlayerNo-1][e_area.Discard].length-1 : 0);
				ele_d.insertBefore(ele[0].parentNode,ele_s);
				ele[ele.length-1].className = 'card';

				var ele_h = document.getElementById("Hand_A2").childNodes;
				var cnt = ele_h.length ;
				for(var i=0;i<cnt;i+=1){ele_h[i].className = 'area' + (i-1);}
            }//手札の捨て札処理
			var ele_g = ele_d.getElementsByClassName('g_top') ;
			if(ele_g.length){ele_g[0].classList.remove('g_top');}
			if(ele_d.lastElementChild.previousElementSibling.previousElementSibling){
				ele_d.lastElementChild.previousElementSibling.previousElementSibling.classList.add('g_top');
			}
			PhaseStart= true ;//ターンエンドに開始宣言はないのでフラグを真に設定
			break ; }//ディスカードフェイズ終了時の処理
	}//フェイズ毎の処理
	document.getElementById("start_declaration").innerHTML = p_text+ "開始";
	document.getElementById("end_declaration").innerHTML = p_text + "終了";

	for(var i=game.length-1;i>=0;i-=1){
		for(var j=sel_Array[i].length-1;j>=0;j-=1){
			var ele_g_top = document.getElementById(sel_Array[i][j]).getElementsByClassName('g_top') ;
			while(ele_g_top.length){
				ele_g_top[0].classList.remove('g_top')
			}
			var ele_div =  document.getElementById(sel_Array[i][j]).getElementsByTagName('div') ;
			if(ele_div.length) {ele_div[ele_div.length-1].classList.add('g_top') }
		}//勢力トップを表示
	}//各プレイヤーの領域に実施

	close_action() ;
	event.stopPropagation(); return false;
}//フェイズ終了時の処理
function turn_end(event,obj) {
	TurnCount++;
	PhaseCount = e_phase.Drow-1 ;//プリインクリメントしているので、ドローのひとつ前を渡す
	phase_end(event,obj) ;//実際の処理はPhase_endで実施

	close_action() ;
	event.stopPropagation(); return false;
}//ターン終了時の処理

function check_sub(obj,actPlayer){
	if(actPlayer != PlayerNo && obj[e_char_def.setcard][e_char_def.power_g].length != 0){return null;}
	return obj[e_char_def.characters];
}//対象の取得。ついでに横取り見越して適正チェックも

function I_check(obj){
	var chr = {};
	var Icon_Array = Object.keys(obj.Icon) ;//アイコンオブジェクトの配列化
	console.log('プレイしたいカードのアイコンは' + Icon_Array) ;
	
	for(var i=0,l=game.length;i<l;i+=1){
		var Icon_Game = [];
		for(var j=0,m=game[i][e_area.Territory][e_area.Force].length;j<m;j+=1){
			Icon_Game.push.apply(Icon_Game,game[i][e_area.Territory][e_area.Force][j]);
		}
		Icon_Game.push.apply(Icon_Game,game[i][e_area.Territory][e_area.Control]) ;
		if(Icon_Game.some(function(target){
			if(chr = check_sub(target,i+1)){
				console.log('チェック中の対象の所持アイコンは' + Object.keys(chr.Icon)) ;
				if(Icon_Array.some(function(Key){
					return (Key in chr.Icon) ;
				})){return true;}
			}
		})){return true;}
	}//各プレイヤーのテリトリーをチェック
	return false ;
}//アイコンチェック

function C_check(obj){
	var i_Cost = 0 ;
	game[PlayerNo-1][e_area.Territory][e_area.Control].forEach(function(e){i_Cost += e[e_char_def.setcard][e_char_def.power_g].length}) ;
	console.log('現在、使用可能なパワーカードは' + i_Cost + '枚で' + my_object_values(obj.Param.Name) + 'の必要コストは' + obj.Cost + 'です。') ;
	if(i_Cost >= obj.Cost){return true ;}
	return false ;
}//コストチェック

function Corect_F(d_array,obj,n){
	var keys = Object.keys(obj) ;
	for( var i=0, l=keys.length; i<l; i+=1) { d_array[card.Force[keys[i]]] += n * obj[keys[i]]; }
}//ファクター情報の収集

function F_check(obj){
	var F_Array = Array.apply(null,Array(Math.max.apply(null, my_object_values(card.Force)))).map(function(){ return 0 }) ;
	game[PlayerNo-1][e_area.Territory][e_area.Control].forEach(function(e){Corect_F(F_Array,check_sub(e,PlayerNo).Force,+1);});//所持ファクターを収集
	console.log('現在のファクターは' + F_Array + 'です') ;
	Corect_F(F_Array,obj.Facter,-1);//減算で必要ファクター数を収集
	if(Math.min.apply(null, F_Array) >= 0){return true ;}//最小値が0以上ならファクターOK
	return false ;
}//ファクターのチェック

function my_object_values(obj) {
	var a = [] ;
	for (var p in obj){ a.push(obj[p]); }
	return a;
};//Object.valuesの代用

function popUp(event,obj) {
	console.log(obj.classList,TurnCount,PhaseCount,ResponseCount) ;
	var disp_array = [] ;
	var act = document.getElementById("Action");
	var cnt = act.childNodes.length;
	for(cnt--;cnt>=0;cnt--){
		act.childNodes[cnt].className='d_none';
	}//アクションの全要素の非表示化
	console.log('ゲーム状況',game) ;
	if(interval_id) { return false ; }//タイマー動作中は操作を受け付けない

	if(!PhaseStart){ disp_array.push(document.getElementById("start_declaration")); }//フェイズを開始していない
	else {
		switch (obj.parentNode.id){
			case "Deck_A2":{
				switch(PhaseCount){
					case e_phase.Drow:{
						if(DrowFlag){ disp_array.push(document.getElementById("drow"));}//ドローがまだ
						break; }//ドローフェイズ
					case e_phase.Power:{
						var ele = document.getElementsByClassName("active");
						if(ele.length && ChargeCount > 0) {
							var idx = 0 ; var idx2 = 0 ; var to = [] ;
							if(ele[0].parentNode.classList.contains('Control_A')){
								idx = ele[0].classList.item(1).substr(4) ;
								to = game[PlayerNo-1][e_area.Territory][e_area.Control][idx] ;
							}
							else{
								if(!ele[0].classList.contains('g_top')){break;}//パワーカードがセット可能な対象ではない
								idx = ele[0].parentNode.classList.item(1).substr(4) ;
								idx2 = ele[0].classList.item(1).substr(1) ;
								to = game[PlayerNo-1][e_area.Territory][e_area.Force][idx][idx2] ;
							}
							if(to[e_char_def.setcard][e_char_def.power_g].length < to[e_char_def.characters].Param.Mind){
								ChargeCount-- ;
								to[e_char_def.setcard][e_char_def.power_g].push({Date:Date.now()}) ;//順番を判定可能なダミーデータを置いておく

								var ele_d = document.createElement('img');
								ele_d.setAttribute("onClick","popUp(event,this)") ;
								ele_d.src = "./Image//Saga3/card_power.gif";
								var ele_l = ele[0].lastElementChild ;
								var ele_pw = ele[0].getElementsByClassName('pw_card') ;
								if(ele_pw.length){
									ele_d.className = 'pw_card i' + ele_pw.length ;
								}//他のカードがセットされている 
								else { ele_d.className = 'pw_card i0' ; }//他にカードがセットされていない

								ele[0].appendChild(ele_d);
							}//パワーカードがセットできる
						}//チャージ残量があり、パワーカードをセットする対象が選択されている
						break ; }//パワーカードフェイズ
					default :{ break; }//その他のフェイズ
				}//フェイズ毎の処理
				break; }//デッキ
			default :{
				switch (obj.parentNode.parentNode.id){
					case "Hand_A2":{
						var idx = obj.parentNode.className.substr(4) ;
						var hands = game[PlayerNo-1][e_area.Hand]
						switch(PhaseCount){
							case e_phase.Main:{
								switch(hands[idx].Type) {
									case e_ctype.breakcard :{}//ブレイクカード　注：このブロックはわざとbreakしてない
									case e_ctype.parmanent :{
										if(!F_check(hands[idx]) || !C_check(hands[idx]) || !I_check(hands[idx])){break;}//使用条件を満たしていない
										}//パーマネントカード　注：このブロックはわざとbreakしてない
									case e_ctype.character :{
										if(ResponseCount != 0){ break; }//使用タイミング不適切
										disp_array.push(document.getElementById("set"));
										break ; }//キャラクターカード
									case e_ctype.project :{
										if(ResponseCount != 0){ break; }//使用タイミング不適切
										}//プロジェクトカード　注：このブロックはわざとbreakしてない
									case e_ctype.fast :{
										disp_array.push(document.getElementById("play"));
										break ; }//ファストカード
									default :{ break; }//それ以外のカード
								}//カードタイプ毎の処理
								break ; }//メインフェイズ
								case e_phase.Power:{
									var ele = document.getElementsByClassName("active");
									if(ele.length){
										var from = game[PlayerNo-1][e_area.Hand];
										var idx3 = obj.parentNode.classList.item(0).substr(4) ;
										var idx = 0 ; var idx2 = 0 ; var to = [] ;

										if(ele[0].parentNode.classList.contains('Control_A')){
											idx2 = ele[0].classList.item(1).substr(4) ;
											to = game[PlayerNo-1][e_area.Territory][e_area.Control][idx2] ;
										}
										else{
											if(!ele[0].classList.contains('g_top')){break;}//パワーカードがセット可能な対象ではない
											idx = ele[0].parentNode.classList.item(1).substr(4) ;
											idx2 = ele[0].classList.item(1).substr(1) ;
											to = game[PlayerNo-1][e_area.Territory][e_area.Force][idx][idx2] ;
										}
										if(to[e_char_def.setcard][e_char_def.power_g].length < to[e_char_def.characters].Param.Mind){
											from[idx3].Type *= -1;//カードタイプをパワーカードへ変更 ;
											to[e_char_def.setcard][e_char_def.power_g].push(from.splice(idx3,1)[0]) ;

											var ele_l = ele[0].lastElementChild ;
											var ele_pw = ele[0].getElementsByClassName('pw_card') ;
											if(ele_pw.length){
												obj.className = 'pw_card o' + ele_pw.length ;
											}//他のカードがセットされている 
											else { obj.className = 'pw_card o0' ; }//他にカードがセットされていない

											var ele_p = obj.parentNode
											for(var ele_c = ele_p.parentNode.lastElementChild;ele_c != ele_p;ele_c = ele_c.previousElementSibling){
												ele_c.className = ele_c.previousElementSibling.className ;
											}//カード位置のスライド
											ele_p.parentNode.removeChild(ele_p);
											ele[0].appendChild(obj);
										}//パワーカードがセットできる
									}//パワーカードをセットする対象が選択されている
								break ; }//パワーカードフェイズ
							case e_phase.Discard:{
								var from = game[PlayerNo-1][e_area.Hand];
								if(Hand_Max < from.length){
									obj.classList.toggle('dr_card') ;
									if(Hand_Max == from.length - document.getElementsByClassName('dr_card').length ){ DiscardFlag = false ; }//手札OK
									else{ DiscardFlag = true ; }//手札NG
								}//手札オーバー
								break ; }//ディスカードフェイズ
							default:{ break ; }//その他のフェイズ
						}//フェイズ毎の処理
						break ; }//手札
					case "EGO_A2":
					case "ARA_A2":
					case "WIZ_A2":
					case "Dar_A2":
					case "Kyo_A2":
					case "Era_A2":
					case "Non_A2":{
						console.log("Force_A") ;
						switch(PhaseCount){
							case e_phase.Main:{
								var ResCnt = Math.round(ResponseCount) ;
								if(ResCnt < ResponseCount){
									var idx = obj.parentNode.parentNode.classList.item(1).substr(4) ;//対象の勢力エリア
									var idx2 = obj.parentNode.classList.item(1).substr(1) ;//対象の勢力エリア内での位置
									var playing = {} ;
									var l = game[PlayerNo-1][e_area.Play].length-1 ;
									do{ playing = game[PlayerNo-1][e_area.Play][l][l--]; }while(playing.hasOwnProperty(ResCnt)) ;//プレイ中のカード情報の取得
									switch(playing.Type){
										case e_ctype.breakcard :{
											var chr = check_sub(force_a2[idx][idx2],PlayerNo) ;
											console.log('対象のキャラクターは勢力エリア',idx,'の',idx2,'番目のキャラクター',chr) ;
											if(chr){
												var Icon_Array = [] ;
												for(name in playing.Icon){Icon_Array.push(name);}
												console.log('目標のアイコン',chr.Icon,'プレイ中のカードのアイコン',Icon_Array) ;
												if(Icon_Array.some(function(Key){if(Key in chr.Icon){return true;}})){
													obj.parentNode.classList.toggle('Target') ;
												}//対象に選択
											}//適正なブレイク対象
											break ; }//ブレイクカードをプレイ中
										case 'Attack' :{
											var chr = check_sub(force_a2[idx][idx2],PlayerNo) ;
											console.log('対象のキャラクターは勢力エリア',idx,'の',idx2,'番目のキャラクター',chr) ;
											if(chr && idx2 == force_a2[idx].length-1){
												obj.parentNode.classList.toggle('Target') ;//対象に選択
											}//適正なアタック対象
											break ; }//ブレイクカードをプレイ中
										default:{ break; }//それ以外の何かをプレイ中
									}//プレイしているカード毎の処理
								}//対象選択中
								if(ResCnt == ResponseCount){
									if(obj.classList.contains('ch_card') || obj.classList.contains('br_card') ){
										if(ResponseCount != 0){
											var playing = {} ;
											var l = game[PlayerNo-1][e_area.Play].length-1 ;
											do{ playing = game[PlayerNo-1][e_area.Play][l][l--]; }while(playing.hasOwnProperty(ResCnt)) ;//プレイ中のカード情報の取得
											switch(playing.Type){
												case 'Attack' :{
													var chr = check_sub(force_a2[idx][idx2],PlayerNo) ;
													console.log('対象のキャラクターは勢力エリア',idx,'の',idx2,'番目のキャラクター',chr) ;
													if(chr && idx2 == force_a2[idx].length-1){
														obj.parentNode.classList.toggle('Target') ;//対象に選択
													}//適正なアタック対象
													break ; }//ブレイクカードをプレイ中
												default:{
													obj.parentNode.classList.toggle('Target') ;//対象の選択・解除
													break; }//それ以外の何かをプレイ中
											}//プレイしているカード毎の処理
										}//アタック宣言可能なタイミング
									}//キャラクターかブレイク
								}//レスポンス中
								break ; }//メインフェイズ
							case e_phase.Power:{
								if(obj.classList.contains('pw_card') && obj.classList.item(1).match(/[io]/)){
									for(var ele = obj.parentNode.lastElementChild;ele != obj;ele = ele.previousElementSibling){
										ele.className = 'pw_card ' +  ele.classList.item(1).charAt(0) + ele.previousElementSibling.classList.item(1).substr(1) ;
									}//パワーカードの位置づめ
									var ele = obj.parentNode ;
									var idx = ele.parentNode.classList.item(1).substr(4) ;
									var idx2 = ele.classList.item(1).substr(1) ;
									var idx3 = obj.classList.item(1).substr(1) ;
									var from = game[PlayerNo-1][e_area.Territory][e_area.Force][idx][idx2] ;
									switch(obj.classList.item(1).charAt(0)){
										case 'i':{
											ChargeCount++ ;
											from[e_char_def.setcard][e_char_def.power_g].splice(idx3,1);

											obj.parentNode.removeChild(obj) ;
											break ;}//手札からセットしていた場合
										case 'o':{
											var to = game[PlayerNo-1][e_area.Hand] ;
											var cd = from[e_char_def.setcard][e_char_def.power_g].splice(idx3,1)[0];
											cd.Type *= -1
											to.push(cd);

											obj.className = 'card' ;
											var ele_h = document.getElementById("Hand_A2") ;
											var ele_l = ele_h.lastElementChild;
											var ele_d = document.createElement('div');
											ele_d.appendChild(obj);
											if(ele_l == null){ ele_d.className = 'area0' ;}
 											else { ele_d.className = 'area' + ( Number(ele_l.classList.item(0).substr(4)) + 1); }
											ele_h.appendChild(ele_d);
											break ; }//チャージの場合
										default : { break ; }//それ以外
									}//手札orチャージ
								}//セットしようとしているカード
								else {
									if(obj.parentNode.nextElementSibling.className == "arrowFL"){
										var ele = document.getElementsByClassName("active");
										while(ele.length){
											ele[0].classList.remove('active');
										}
										obj.parentNode.classList.add('active') ;
									}
								}
								break ; }//パワーカードフェイズ
							default:{ break ; }//それ以外のフェイズ
						}
						break ; }//勢力エリア
					case "Control_A2":{
						console.log("Control_A2") ;
						switch(PhaseCount){
							case e_phase.Aggressive:{
								var ResCnt = Math.round(ResponseCount) ;
								if(ResCnt > ResponseCount){
									if(obj.classList.contains('pw_card')){
										if(obj.parentNode.classList.contains('Guarder')){
											obj.classList.toggle('Pay') ;
										}//対象がガード宣言しているか？
									}//対象がパワーカード
								}//コスト支払中
								if(ResCnt == ResponseCount){
									if(obj.classList.contains('ch_card') || obj.classList.contains('br_card') ){
										var ele_pw = obj.parentNode.getElementsByClassName('pw_card') ;
										if(ele_pw.length){
											if(ResponseCount == 1 && game[PlayerNo-1][e_area.Play][0][0].Type == 'Attack'){
												obj.parentNode.classList.toggle('Guarder') ;//対象の選択・解除
													if(obj.parentNode.classList.contains('Guarder')){
														disp_array.push(document.getElementById("guard"));
													}//現状複数ガードOKだが、システム的にあり得るのでこのまま
												}//ガード宣言可能なタイミング
											//if(エフェクトを持っている)//エフェクト処理が入る
										}//パワーカードがある　インターセプトは別枠？クラスでインターセプト持たせておく？
									}//キャラクターかブレイク
								}//レスポンス中
								break; }
							case e_phase.Main:{
								var ResCnt = Math.round(ResponseCount) ;
								if(ResCnt < ResponseCount){
									var playing = {} ;
									var l = game[PlayerNo-1][e_area.Play].length-1 ;
									do{ playing = game[PlayerNo-1][e_area.Play][l][l--]; }while(playing.hasOwnProperty(ResCnt)) ;//プレイ中のカード情報の取得
									switch(playing.Type){
										case e_ctype.breakcard :{
											if(obj.classList.contains('ch_card') || obj.classList.contains('br_card') ){
												var idx = obj.parentNode.classList.item(1).substr(4) ;
												var chr = check_sub(control_a2[idx],PlayerNo) ;
												console.log('対象のキャラクターは支配エリアの',idx,'番目のキャラクター',chr) ;
												if(chr){
													var Icon_Array = [] ;
													for(name in playing.Icon){Icon_Array.push(name);}
													console.log('目標のアイコン',chr.Icon,'プレイ中のカードのアイコン',Icon_Array) ;
													if(Icon_Array.some(function(Key){if(Key in chr.Icon){return true;}})){
														obj.parentNode.classList.toggle('Target') ;
													}//対象に選択
												}//適正なブレイク対象
											}//対象がキャラクターかブレイク
											break ; }//ブレイクカードをプレイ中
										default:{ break; }//それ以外の何かをプレイ中
									}//プレイしているカード毎の処理
								}//対象選択中
								if(ResCnt > ResponseCount){
									var idx = obj.parentNode.classList.item(1).substr(4) ;//対象の支配エリア内での位置
									var playing = {} ;
									var l = game[PlayerNo-1][e_area.Play].length-1 ;
									do{ playing = game[PlayerNo-1][e_area.Play][l][l--]; }while(playing.hasOwnProperty(ResCnt-1)) ;//プレイ中のカード情報の取得
									console.log('現在プレイ中なのは' + playing.Type + 'です')
									switch(playing.Type){
										case 'Attack' :{
											if(obj.classList.contains('pw_card')){
												if(obj.parentNode.classList.contains('Attacker')){
													obj.classList.toggle('Pay') ;
												}//対象がアタック宣言しているか？
											}//対象がパワーカード
											break ; }//アタック宣言中
										default:{
											if(obj.classList.contains('pw_card')){
												obj.classList.toggle('Pay') ;
											}//対象がパワーカード
										 break; }//それ以外の何かをプレイ中
									}//プレイしているカード毎の処理
								}//コスト支払中
								if(ResCnt == ResponseCount){
									if(obj.classList.contains('ch_card') || obj.classList.contains('br_card') ){
										var ele_pw = obj.parentNode.getElementsByClassName('pw_card') ;
										if(ele_pw.length){
											switch(ResCnt){
											case 0 :{
												obj.parentNode.classList.toggle('Attacker') ;//対象の選択・解除
												if(obj.parentNode.classList.contains('Attacker')){
													disp_array.push(document.getElementById("attack"));
												}//現状複数アタックOKだが、システム的にあり得るのでこのまま
												break; }
											case 1 :{
												if(game[PlayerNo-1][e_area.Play][0][0]  == 'Attack'){
													obj.parentNode.classList.toggle('Guarder') ;//対象の選択・解除
													if(obj.parentNode.classList.contains('Guarder')){
														disp_array.push(document.getElementById("guard"));
													}//現状複数ガードOKだが、システム的にあり得るのでこのまま
												}//最初にプレイされたのがアタック宣言の場合
												break; }
											default : {break;}//それ以降のレスポンス
											}//レスポンスタイミング
											//if(エフェクトを持っている)//エフェクト処理が入る
										}//パワーカードがある　インターセプトは別枠？
									}//キャラクターかブレイク
								}//レスポンス中
								break ; }//メインフェイズ
							case e_phase.Power:{
								if(obj.classList.contains('pw_card') && obj.classList.item(1).match(/[io]/)){
									for(var ele = obj.parentNode.lastElementChild;ele != obj;ele = ele.previousElementSibling){
										ele.classList.item(1) =ele.classList.item(1).charAt(0) +ele.previousElementSibling.classList.item(1).substr(1) ;
									}//パワーカードの位置づめ
									var ele = obj.parentNode ;
									var idx = ele.classList.item(1).substr(4) ;
									var idx2 = obj.classList.item(1).substr(1) ;
									switch(obj.classList.item(1).charAt(0)){
										case 'i':{
											ChargeCount++ ;
											var from = game[PlayerNo-1][e_area.Territory][e_area.Control][idx] ;
											from[e_char_def.setcard][e_char_def.power_g].splice(idx2,1);

											obj.parentNode.removeChild(obj) ;
											break ;}//手札からセットしていた場合
										case 'o':{
											var from = game[PlayerNo-1][e_area.Territory][e_area.Control][idx] ;
											var to = game[PlayerNo-1][e_area.Hand] ;
											var cd = from[e_char_def.setcard][e_char_def.power_g].splice(idx2,1)[0];
											cd.Type *= -1
											to.push(cd);

											obj.className = 'card' ;
											var ele_h = document.getElementById("Hand_A2") ;
											var ele_l = ele_h.lastElementChild;
											var ele_d = document.createElement('div');
											ele_d.appendChild(obj);
											if(ele_l == null){ ele_d.className = 'area0' ;}
 											else { ele_d.className = 'area' + ( Number(ele_l.className.item(1).substr(4)) + 1); }
											ele_h.appendChild(ele_d);
											break ; }//チャージの場合
										default : { break ; }//それ以外
									}//手札orチャージ
								}//セットしようとしているカード
								else {
									var ele = document.getElementsByClassName("active");
									while(ele.length){ele[0].classList.remove('active'); }
									obj.parentNode.classList.add('active') ;
								}//パワーカードセット対象を変更
								break ; }//パワーカードフェイズ
							default:{ break ; }//それ以外のフェイズ
						}//フェイズ毎の処理
						break ; }//支配エリアの処理
					default:{
						console.log("Game") ;
						var ResCnt = Math.round(ResponseCount) ;
						if(ResponseCount > ResCnt){
							if(document.getElementsByClassName('Target').length == iTargets){ disp_array.push(document.getElementById("target"));}//対象数適正
						}//対象選択中
						if(ResponseCount < ResCnt){
							if(play2[ResCnt-1][ResCnt-1].Cost == document.getElementsByClassName('Pay').length){
								disp_array.push(document.getElementById("paycost"));
							}//適正コスト
						}//コスト支払中
						if(ResponseCount == ResCnt){
							if(ResponseCount != 0){ disp_array.push(document.getElementById("response")); } //レスポンス中
							else {
								if(PhaseCount == e_phase.Aggressive && (ForceCount < force_a2.length-1 || (ForceCount == force_a2.length-1 && force_a2[e_area.Non].length))){ disp_array.push(document.getElementById("forcecheck")); }//勢力チェック中
								else {
									if(!DrowFlag && !DiscardFlag){
										if(PhaseCount <= e_phase.Discard){ disp_array.push(document.getElementById("end_declaration")); }//ディスカードフェイズが終了していない
										else { disp_array.push(document.getElementById("turn")); }//ディスカードフェイズが終了している＝ターン終了
									}//ドローしてないor手札オーバーでない
								}//
								}//レスポンス解決済み
							}//対象選択・コスト支払済み
						break ;}//それ以外のエリアの処理
					break; }//それ以外のエリア
				break ;}//手札・勢力・支配エリア
		}//エリア毎の処理
	}//フェイズ中の処理
	if(!disp_array.length){ act.classList.add('d_none'); }//表示する要素があれば表示
	else{
		var ele_select = document.getElementsByClassName('selected') ;
		if(ele_select.className == obj.className){act.classList.toggle('d_none');}
		else{act.classList.remove('d_none') ;}
		if(!act.classList.contains('d_none')){
			while(disp_array.length){
				console.log(disp_array) ;
				var ele = disp_array.pop() ;
				ele.nextElementSibling.classList.remove('d_none')
				ele.classList.remove('d_none') ;
			}//表示処理
		}//行動選択が非表示なら内容も非表示のまま
	}//条件を満たす選択肢のみ表示

	act.style.left = event.pageX + DiffPageX; act.style.top = event.pageY + DiffPageY;//表示座標の修正
	obj.classList.add('selected');
	var ele = document.getElementsByClassName('selected') ;
	for(i=ele.length-1;i>=0;i-=1){
		if(obj != ele[i]){ ele[i].classList.remove('selected'); }
	}

	event.stopPropagation(); return false ;
}//画面クリック時の処理
function arrowL(event,obj){
	ele = obj.parentNode.getElementsByClassName("g_top");

	if(ele[0].nextElementSibling.tagName != 'SPAN'){
		ele[0].nextElementSibling.classList.add('g_top');
		ele[0].classList.remove('g_top');
	}//最後じゃない
	event.stopPropagation(); return false ;
}//後ろへ
function arrowR(event,obj){
	ele = obj.parentNode.getElementsByClassName("g_top");
	if(ele[0].previousElementSibling){
		ele[0].previousElementSibling.classList.add('g_top');
		ele[1].classList.remove('g_top');
	}//最初じゃない
	event.stopPropagation(); return false ;
}//前へ
function g_start(){
	var n = deck2.length, i;
	for(i=2;i>0;i-=1){
		while (n) {
			i = Math.floor(Math.random() * n--);
			var t = deck2[n]; deck2[n] = deck2[i]; deck2[i] = t;
		}//デッキシャッフル
		}//2回ぐらい
	if(window.chrome){DiffPageY = -35 ;} //ブラウザ対応（今のとこChromeのみ）
	//モバイル判定
	if((typeof window.orientation != "undefined") || (navigator.userAgent.indexOf("Windows Phone") != -1)){document.body.style.fontSize = '200%';document.getElementById('Action').style.width='400px';}
	if(window.confirm('ソロプレイを開始しますか？')){
		DrawCount = 1 ;
		soloplay() ;
		window.alert('ソロプレイを開始します。'); }// 「OK」時の処理終了
	else{ window.alert('通常対戦はまだ実装されていません。\nフリープレイをお楽しみください。'); }// 「キャンセル」時の処理終了
}//初期化処理

function soloplay(){
	while(skill_check(game[PlayerNo-1][e_area.Territory][e_area.Force],'Aggressive')<5){
		console.log('▼持ちは現在、' + skill_check(game[PlayerNo-1][e_area.Territory][e_area.Force],'Aggressive') + '体') ;
		var ele_a = card_open(game[PlayerNo-1][e_area.Deck]) ;//Play領域が特殊なので先に公開時の表示情報を取得しておく
		var check = game[PlayerNo-1][e_area.Deck].pop() ;
		switch(check.Type){
			case e_ctype.character :{
				var Playing = {} ; Playing[ResponseCount] = check ;
				game[PlayerNo-1][e_area.Play].push(Playing);
				ResponseCount+=1 ;

				var ele_p = document.getElementById("Play_A2").firstElementChild;//Play_Bの取得
				ele_a.firstElementChild.className = 'ch_card';
				ele_a.className = 'c_set';
				ele_a.classList.add('p' + Math.round(ResponseCount-1));
				ele_a.classList.add('g_top');
				var ele_s = ele_p.lastElementChild.previousElementSibling//arrowFLの取得
				ele_p.insertBefore(ele_a,ele_s);
				
				var evt = document.createEvent("MouseEvents");
				evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				response_end(evt,document.getElementById('Game')) ;
				break ; }//キャラクターは勢力エリアにセットされる
			default :{
				game[PlayerNo-1][e_area.Discard].push(check) ;

				var ele_p = document.getElementById("Discard_A2").firstElementChild;//Play_Bの取得
				ele_a.className = 'dis';
				ele_a.classList.add('p' + Number(game[PlayerNo-1][e_area.Discard].length ? game[PlayerNo-1][e_area.Discard].length-1 : 0));
				ele_a.classList.add('g_top');
				var ele_s = ele_p.lastElementChild.previousElementSibling//arrowFLの取得
				ele_p.insertBefore(ele_a,ele_s);
				if(ele_s.previousElementSibling.previousElementSibling){
					ele_s.previousElementSibling.previousElementSibling.classList.remove('g_top') ;
				}
				break; }//それ以外はダメージ置き場へ
		}//カードタイプ毎の処理
	}//準備中
	console.log('▼持ちは現在、' + skill_check(game[PlayerNo-1][e_area.Territory][e_area.Force],'Aggressive') + '体') ;

}//ソロプレイ用初期化処理
