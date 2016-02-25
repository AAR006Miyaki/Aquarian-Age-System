// Gameデータ
var DiffPageX=-30,DiffPageY=-15;//ブラウザ別座標補正用変数
const e_force = {Ego:0,Ara:1,Wiz:2,Dar:3,Kyo:4,Era:5,Non:6};//勢力位置列挙定数
const sel_Array = [
		["EGO_A1","ARA_A1","WIZ_A1","Dar_A1","Kyo_A1","Era_A1","Non_A1"],
		["EGO_A2","ARA_A2","WIZ_A2","Dar_A2","Kyo_A2","Era_A2","Non_A2"]
	];//上の列挙定数に対応した各プレイヤーの勢力エリア名の配列
const Force_Name = ["E.G.O.","阿羅耶識","WIZ-DOM","ダークロア","極星帝国","イレイザー","勢力なし"];//同じく上の列挙定数に対応した勢力名の配列
const e_area = {
	Territory:0,
		Force:0,
			Ego:0,
			Ara:1,
			Wiz:2,
			Dar:3,
			Kyo:4,
			Era:5,
			Her:6,
			Non:6,
		Control:1,
		Spell:2,
	Cost:1,
	Play:2,
	Hand:3,
	Deck:4,
	Discard:5,
	Damege:6,
	Exclusion:7
};//プレイヤーのエリア構成を記述した列挙定数
const e_ctype = {character:1,breakcard:2,parmanent:4,project:8,fast:16};//カードタイプ列挙定数
const e_char_def = {
	characters:0,
	character:1,
		break_g:0,
		character_g:1,
	setcard:2,
		parmanent_g:0,
		power_g:1
};//キャラクター構造を記述した列挙定数
const e_phase = {Drow:0,Aggressive:1,Main:2,Power:3,Discard:4};//フェイズの並びを記述した列挙定数
var PhaseCount = e_phase.Drow;//フェイズカウンタ：初期値ドローフェイズ
var PhaseStart = false ;//フェイズ開始を管理するフラグ：初期値:偽
var TurnCount = 0 ;//ターンカウンタ：初期値0
var ForceCount = e_force.Ego ;//勢力フェイズ中の勢力チェックカウンタ：初期値E.G.O.
var ResponseCount = 0 ;//レスポンスカウンタ：初期値0
var DrawCount = 7 ;//ドローカウンタ：初期値7
var DrowFlag = true ;//ドローフラグ
var ChargeCount = 0 ;//チャージカウンタ：初期値0
var PlayerNo = 2;//
var Hand_Max = 7 ;
var DiscardFlag = false ;
var Damege_Max = 10 ;
var Select_Target = {} ;
var iTargets =1 ;/*対象の数 */

var card = {
	No:{Saga:4,Code:"No",Num:1,Serial:{}},//Serialは再収録カードのみ持ちます。再収録の元になったカードのNoオブジェクト　例saga1のNo1の再収録の場合（Serial:{Saga:1,Code:"No",Num:1}）
	Type:e_ctype,
	Force:{Ego:0,Ara:1,Wiz:2,Dar:3,Kyo:4,Era:5,Her:6,Ego_F:0,Ara_F:1,Wiz_F:2,Dar_F:3,Kyo_F:4,Era_F:5,Her_F:6},
	Param:{
		Mind:2,
		Attack:2,
		MindAttack:0,
		Difense:1,
		Skill:{
			Draw:['-X,,,-2,-1,1,2,3,,,,,X'],
			Charge:['-X,,,-2,-1,1,2,3,,,,,X'],
			Stealth:0,
			Protect:{Facter:{Ego:1,Ara:1,Wiz:1,Dar:1,Kyo:1,Era:1,Her:1}},
			Aggressive:0,
			Boost:['1,2,3,,,,,9,X'],
			Parmanent:['-X,,,-2,-1,1,2,3,,,,,X'],
			Penetrate:0,
			Initiative:0,
			Infinite:0,
			Breakthrough:0,
			Capacity:['-X,,,-2,-1,1,2,3,,,,,X'],
			Synchro:0,
			Resist:{
				Facter:{Ego:1,Ara:1,Wiz:1,Dar:1,Kyo:1,Era:1,Her:1},
				Icon:{StudentF:1,StudentM:1,WorkerF:1,WorkerM:1,AthleteF:1,AthleteM:1,ScholarF:1,ScholarM:1,TalentF:1,TalentM:1,Ghost:1,MediumF:1,MediumM:1,CreatureF:1,CreatureM:1,MysticF:1,MysticM:1,VampireF:1,VampireM:1,OgreF:1,OgreM:1,MonsterF:1,MonsterM:1,DevilF:1,DevilM:1,Mermaid:1,WeretigerF:1,WeretigerM:1,WerewolfF:1,WerewolfM:1,Android:1,EraserF:1,EraserM:1,DragoonF:1,DragoonM:1,CyborgF:1,CyborgM:1,Machine:1,WarriorF:1,WarriorM:1,ScannerF:1,ScannerM:1,Undead:1,TriF:1,TriM:1,Shiki:1,Flame:1,Marionette:1}
			},
			Intercept:0,
			Remove:['1,2,3,,,,,9,X'],
			Offensive:0,
			Defensive:0,
			Shield:0,
			Bind:['1,2,3,,,,,9,X'],
			Dual:0,
			Search:{
				Facter:{E_F:1,A_F:1,W_F:1,D_F:1,K_F:1,Er_F:1,H_F:1},
				Icon:{
					StudentF:1,StudentM:1,WorkerF:1,WorkerM:1,AthleteF:1,AthleteM:1,ScholarF:1,ScholarM:1,TalentF:1,TalentM:1,Ghost:1,
					MediumF:1,MediumM:1,CreatureF:1,CreatureM:1,MysticF:1,MysticM:1,VampireF:1,VampireM:1,OgreF:1,OgreM:1,MonsterF:1,MonsterM:1,DevilF:1,DevilM:1,
					Mermaid:1,WeretigerF:1,WeretigerM:1,WerewolfF:1,WerewolfM:1,Android:1,EraserF:1,EraserM:1,DragoonF:1,DragoonM:1,CyborgF:1,CyborgM:1,Machine:1,
					WarriorF:1,WarriorM:1,ScannerF:1,ScannerM:1,Undead:1,TriF:1,TriM:1,Shiki:1,Flame:1,Marionette:1
				},
				other:{}
			}
		},
		Name:{
			Class:"エンジェル女子高生",
			Person:""
		},
		Text:{text:""}
	},
	Icon:{StudentF:0,StudentM:1,WorkerF:2,WorkerM:3,AthleteF:4,AthleteM:5,ScholarF:6,ScholarM:7,TalentF:8,TalentM:9,Ghost:10,MediumF:11,MediumM:12,CreatureF:13,CreatureM:14,MysticF:15,MysticM:16,VampireF:17,VampireM:18,OgreF:19,OgreM:20,MonsterF:21,MonsterM:22,DevilF:23,DevilM:24,Mermaid:25,WeretigerF:26,WeretigerM:27,WerewolfF:28,WerewolfM:29,Android:30,EraserF:31,EraserM:32,DragoonF:33,DragoonM:34,CyborgF:35,CyborgM:36,Machine:37,WarriorF:38,WarriorM:39,ScannerF:40,ScannerM:41,Undead:42,TriF:43,TriM:44,Shiki:45,Flame:46,Marionette:47},
	Facter:{Ego:1,Ara:1,Wiz:1,Dar:1,Kyo:1,Era:1,Her:1},
	Cost:0,
	Range:{Target:0,Area:0},
	Time:{Instant:0,Duration:0}
};

var card1 = {No:{Saga:3,Code:"No",Num:1},Type:1,Force:{Ego:1},Param:{Mind:2,Attack:2,Difense:1,Name:{Class:"エンジェル女子高生"},Text:{text:"「あなたには、知っておいてほしいの・・・・・・」"}},Icon:{StudentF:1,EraserF:1}};
var card2 = {No:{Saga:3,Code:"No",Num:2},Type:1,Force:{Ego:1},Param:{Mind:2,Attack:1,Difense:1,Skill:{Synchro:1},Name:{Class:"シンクロ・ツイン"}},Icon:{ScholarF:1,ScannerF:1}};
var card3 = {No:{Saga:3,Code:"No",Num:3},Type:1,Force:{Ego:1},Param:{Mind:2,Attack:1,Difense:1,Skill:{Charge:[1]},Name:{Class:"天才ゴルファー"}},Icon:{WorkerF:1,AthleteF:1}};
var card4 = {No:{Saga:3,Code:"No",Num:4},Type:1,Force:{Ego:1},Param:{Mind:2,Attack:2,Difense:1,Skill:{Charge:[1],Aggressive:1},Name:{Class:"夜遊び女子高生"}},Icon:{StudentF:1,VampireF:1}};
var card5 = {No:{Saga:3,Code:"No",Num:5},Type:1,Force:{Ego:1},Param:{Mind:2,Attack:1,Difense:1,Skill:{Charge:[1],Resist:{Facter:{Kyo:1}},Aggressive:1},Name:{Class:"超能力小学生"}},Icon:{StudentF:1,ScannerF:1}};
var card6 = {No:{Saga:3,Code:"No",Num:6},Type:1,Force:{Ego:1},Param:{Mind:3,Attack:2,Difense:1,Skill:{Charge:[1],Bind:[1],Aggressive:1},Name:{Class:"包帯少女"}},Icon:{TalentF:1,Machine:1,Undead:1}};
var card7 = {No:{Saga:3,Code:"No",Num:7},Type:1,Force:{Ego:1},Param:{Mind:0,Attack:0,Difense:3,Skill:{Charge:[1],Intercept:1},Name:{Class:"インストロイド"}},Icon:{AthleteF:1,Android:1}};
var card8 = {No:{Saga:3,Code:"No",Num:8},Type:1,Force:{Ego:1},Param:{Mind:3,Attack:2,Difense:1,Skill:{Draw:[1],Aggressive:1},Name:{Class:"女車掌"}},Icon:{Machine:1,WorkerF:1}};
var card9 = {No:{Saga:3,Code:"No",Num:9},Type:1,Force:{Ego:1},Param:{Mind:2,Attack:1,Difense:1,Skill:{Charge:[1],Capacity:[-1],Shield:1},Name:{Class:"ティータイムメイド"}},Icon:{MysticF:1,WorkerF:1}};
var card10 = {No:{Saga:3,Code:"No",Num:10},Type:2,Force:{Ego:1},Param:{Mind:3,Attack:2,Difense:2,Skill:{Charge:[1]},Name:{Class:"写真部員"},Text:{text:"「一瞬を切り取るために、じっと待つことができなくちゃね」"}},Icon:{StudentF:1,WerewolfF:1},Facter:{Ego:1},Cost:0};
var card11 = {No:{Saga:3,Code:"No",Num:11},Type:2,Force:{Ego:1},Param:{Mind:3,Attack:2,Difense:2,Skill:{Draw:[1]},Name:{Class:"アンドロイドメイド"},Text:{text:"「0715　旦那様お目覚め完了。0720　ご朝食準備完了。0800　旦那様出勤完了。0820現在　清掃開始」"}},Icon:{WorkerF:1,Android:1},Facter:{Ego:1},Cost:0};
var card12 = {No:{Saga:3,Code:"No",Num:12},Type:2,Force:{Ego:1},Param:{Mind:3,Attack:2,Difense:2,Skill:{Charge:[1],Resist:{Facter:{Kyo:1}}},Name:{Class:"超能力研究者"},Text:{text:"「いいとこに来たね。たった今面白いことに気付いたところでね。ちょっと実験に協力してくれよ」"}},Icon:{ScholarF:1,ScannerF:1},Facter:{Ego:1},Cost:1};
var card13 = {No:{Saga:3,Code:"No",Num:13},Type:2,Force:{Ego:1},Param:{Mind:3,Attack:2,Difense:2,Skill:{Charge:[1],Shield:1},Name:{Class:"ネットアイドル"},Text:{text:"「水泳の授業をサボって校舎裏でおしゃべり。このあとみつかって怒られちゃいました。てへ☆*^_^*ゞ」"}},Icon:{Machine:1,TalentF:1},Facter:{Ego:1},Cost:1};
var card14 = {No:{Saga:3,Code:"No",Num:14},Type:2,Force:{Ego:1},Param:{Mind:4,Attack:3,Difense:3,Skill:{Offensive:1,Defensive:1},Name:{Class:"インラインスケーター"},Text:{text:"「おっはよーっ！　まったねーっ！」"}},Icon:{StudentF:1,AthleteF:1},Facter:{Ego:2},Cost:1};
var card15 = {No:{Saga:3,Code:"No",Num:15},Type:2,Force:{Ego:1},Param:{Mind:3,Attack:2,Difense:2,Skill:{Draw:[1],Resist:{Facter:{Kyo:1}}},Name:{Class:"コマンダー"},Text:{text:"「アタシはね、負ける戦いはしない主義だ。そのアタシが戦うからには、勝ってことさ」"}},Icon:{WorkerF:1,WarriorF:1},Facter:{Ego:1},Cost:1};

var card171 = {No:{Saga:3,Code:"No",Num:171},Type:1,Force:{Era:1},Param:{Mind:1,Attack:3,Difense:1,Name:{Class:"スペースパイロット"},Text:{text:"「この振動、たまんないね」"}},Icon:{Machine:1,WarriorF:1}};
var card172 = {No:{Saga:3,Code:"No",Num:172},Type:1,Force:{Era:1},Param:{Mind:1,Attack:2,Difense:1,Skill:{Defensive:1},Name:{Class:"ラブルドラグーン"}},Icon:{DragoonF:1,WarriorF:1}};
var card173 = {No:{Saga:3,Code:"No",Num:173},Type:1,Force:{Era:1},Param:{Mind:1,Attack:2,Difense:1,Skill:{Charge:[1]},Name:{Class:"ドラグーン・シャーマン"}},Icon:{DragoonF:1,MysticF:1}};
var card174 = {No:{Saga:3,Code:"No",Num:174},Type:1,Force:{Era:1},Param:{Mind:1,Attack:3,Difense:1,Skill:{Charge:[1],Aggressive:1},Name:{Class:"サイバークローン"}},Icon:{CyborgF:1,CreatureF:1}};
var card175 = {No:{Saga:3,Code:"No",Num:175},Type:1,Force:{Era:1},Param:{Mind:1,Attack:2,Difense:1,Skill:{Charge:[1],Aggressive:1,Resist:{Facter:{Ego:1}}},Name:{Class:"インプランテッド"}},Icon:{CyborgF:1,WarriorF:1}};
var card176 = {No:{Saga:3,Code:"No",Num:176},Type:1,Force:{Era:1},Param:{Mind:2,Attack:3,Difense:1,Skill:{Charge:[1],Aggressive:1,Bind:[1]},Name:{Class:"エンジェル中学生"}},Icon:{EraserF:1,StudentF:1,Ghost:1}};
var card177 = {No:{Saga:3,Code:"No",Num:177},Type:1,Force:{Era:1},Param:{Mind:0,Attack:0,Difense:3,Skill:{Charge:[1],Intercept:1},Name:{Class:"アンドロイド・タイプＨ"}},Icon:{Android:1,CreatureF:1}};
var card178 = {No:{Saga:3,Code:"No",Num:178},Type:1,Force:{Era:1},Param:{Mind:2,Attack:3,Difense:1,Skill:{Draw:[1],Aggressive:1},Name:{Class:"エンジェルメイド"}},Icon:{EraserF:1,WorkerF:1}};
var card179 = {No:{Saga:3,Code:"No",Num:179},Type:1,Force:{Era:1},Param:{Mind:1,Attack:2,Difense:1,Skill:{Charge:[1],Capacity:[-1],Shield:1},Name:{Class:"トライオペレーター"}},Icon:{TriF:1,CyborgF:1}};
var card186 = {No:{Saga:3,Code:"No",Num:186},Type:2,Force:{Era:1},Param:{Mind:2,Attack:4,Difense:2,Skill:{Charge:[1]},Name:{Class:"ヒートドラグーン"},Text:{text:"「オイオイ、マジで勝てると思ってンの？」"}},Icon:{DragoonF:1},Facter:{Era:1},Cost:0};
var card187 = {No:{Saga:3,Code:"No",Num:187},Type:2,Force:{Era:1},Param:{Mind:2,Attack:4,Difense:2,Skill:{Draw:[1]},Name:{Class:"ドラグーン・チャンピオン"},Text:{text:"「常に戦の準備を怠らず、弓を取る心構えを持ち続けること。それができなくば戦士の頭は務まらぬ」"}},Icon:{DragoonF:1},Facter:{Era:1},Cost:0};
var card188 = {No:{Saga:3,Code:"No",Num:188},Type:2,Force:{Era:1},Param:{Mind:2,Attack:4,Difense:2,Skill:{Charge:[1],Resist:{Facter:{Ego:1}}},Name:{Class:"アンドロイド・タイプＰ"},Text:{text:"「フォトンチッド充填完了」"}},Icon:{Android:1},Facter:{Era:1},Cost:1};
var card189 = {No:{Saga:3,Code:"No",Num:189},Type:2,Force:{Era:1},Param:{Mind:2,Attack:4,Difense:2,Skill:{Charge:[1],Shield:1},Name:{Class:"シールド・エンジェル"},Text:{text:"「ここもキケンなのお？」"}},Icon:{EraserF:1},Facter:{Era:1},Cost:1};
var card190 = {No:{Saga:3,Code:"No",Num:190},Type:2,Force:{Era:1},Param:{Mind:3,Attack:5,Difense:3,Skill:{Boost:[1]},Name:{Class:"エアボーグ"},Text:{text:"「先行するッ！ 後詰は任せたッ！」"}},Icon:{CyborgF:1},Facter:{Era:2},Cost:1};
var card191 = {No:{Saga:3,Code:"No",Num:191},Type:2,Force:{Era:1},Param:{Mind:2,Attack:4,Difense:2,Skill:{Charge:[1]},Name:{Class:"デュナミス"},Text:{text:"「裁きの刃に逆らうとは」"}},Icon:{EraserF:1},Facter:{Era:1},Cost:1};


var deck1 = [card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card,card];

var deck2 = [
	card1,Object.assign({}, card1),
	card2,Object.assign({}, card2),
	card3,Object.assign({}, card3),
	card4,Object.assign({}, card4),
	card5,Object.assign({}, card5),
	card6,Object.assign({}, card6),
	card7,Object.assign({}, card7),
	card8,Object.assign({}, card8),
	card9,Object.assign({}, card9),
	card10,Object.assign({}, card10),
	card11,Object.assign({}, card11),
	card12,Object.assign({}, card12),
	card13,Object.assign({}, card13),
	card14,Object.assign({}, card14),
	card15,Object.assign({}, card15),
	card171,Object.assign({}, card171),
	card172,Object.assign({}, card172),
	card173,Object.assign({}, card173),
	card174,Object.assign({}, card174),
	card175,Object.assign({}, card175),
	card176,Object.assign({}, card176),
	card177,Object.assign({}, card177),
	card178,Object.assign({}, card178),
	card179,Object.assign({}, card179),
	card186,Object.assign({}, card186),
	card187,Object.assign({}, card187),
	card188,Object.assign({}, card188),
	card189,Object.assign({}, card189),
	card190,Object.assign({}, card190),
	card191,Object.assign({}, card191)
];


var cost1 = new Array(); var cost2 = new Array();
var play1 = new Array(); var play2 = new Array();
var hand1 = new Array(); var hand2 = new Array();
var discard1 = new Array(); var discard2 = new Array();
var damege1 = new Array(); var damege2 = new Array();
var exclusion1 = new Array(); var exclusion2 = new Array();

//var break_g = new Array(); var character_g = new Array(); var parmanent_s = new Array(); var parmanent_g = new Array(); var power_g = new Array();
//var character = [break_g,character_g]; var setcard = [parmanent_g,power_g]; var character_s = [card,character,setcard];
var spell_a1 = new Array(); var spell_a2 = new Array();
var control_a1 = new Array(); var control_a2 = new Array();
var e_a1 = new Array(); var e_a2 = new Array();
var a_a1 = new Array(); var a_a2 = new Array();
var w_a1 = new Array(); var w_a2 = new Array();
var d_a1 = new Array(); var d_a2 = new Array();
var k_a1 = new Array(); var k_a2 = new Array();
var er_a1 = new Array(); var er_a2 = new Array();
var n_a1 = new Array(); var n_a2 = new Array();
var force_a1 = [e_a1,a_a1,w_a1,d_a1,k_a1,er_a1,n_a1]; var force_a2 = [e_a2,a_a2,w_a2,d_a2,k_a2,er_a2,n_a2];
var territory1 = [force_a1,control_a1,spell_a1]; var territory2 = [force_a2,control_a2,spell_a2];
var player1 = [territory1,cost1,play1,hand1,deck1,discard1,damege1,exclusion1];
var player2 = [territory2,cost2,play2,hand2,deck2,discard2,damege2,exclusion2];
var game = [player1,player2];



