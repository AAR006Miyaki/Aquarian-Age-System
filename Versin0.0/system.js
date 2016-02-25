var interval_id = null ;
var interval_cnt = 0 ;


function get_position(obj,i){ return (obj ? (Number.isNaN(Number(obj.substr(1))) ? (Number.isNaN(Number(i)) ? 0 : Number(i)-1) : (Number(obj.substr(1)) + (Number.isNaN(Number(i)) ? 0 : Number(i)))) : 0); }//�p���[�J�[�h�̈ʒu����Ԃ�

function make_area(obj,i) { return 'area' + (obj ? Number(obj.substr(4))+i : i ); }//�G���A���̂�Ԃ�

function close_action(){
	document.getElementById("Action").classList.add('d_none');
	var ele = document.getElementsByClassName('selected');
	while(ele.length){ele[0].classList.remove('selected')}
}//�s���I���E�B���h�E�̔�\����

function skill_count(obj,skill){//������card�I�u�W�F�N�g,�X�L�����̕�����
	if(obj){
		if(obj.hasOwnProperty('Param')){
			if(obj['Param'].hasOwnProperty('Skill')){
				if(obj['Param']['Skill'].hasOwnProperty(skill)){
					if(Array.isArray(obj['Param']['Skill'][skill])){
						if(skill == 'Boost'){return Math.max.apply(null, obj['Param']['Skill'][skill]);}//�u�[�X�g�̏ꍇX�ȉ�OK�Ȃ̂ōő�l
						if(skill == 'Bind'){return Math.min.apply(null, obj['Param']['Skill'][skill]);}//�o�C���h�i�ꉞ�A�ŏ��l��Ԃ��Ă邯�ǂǂ�����ׂ����E�E�E�j
						var cnt = 0 ; for(var i=0,l=obj['Param']['Skill'][skill].length;i<l;i+=1){cnt += Number(obj['Param']['Skill'][skill][i]) ;}
						return cnt;//����ȊO�͍��v�l�i�h���[�E�`���[�W�E�p�[�}�l���g�E�L���p�V�e�B�E�����[�u�j
					}//
					if(Number.isInteger(obj['Param']['Skill'][skill])){ return Number(obj['Param']['Skill'][skill]);}//��L���������ɒǉ����������Ȃ��X�L���S��
					//����ȊO�̓I�u�W�F�N�g�Ȃ̂Ōʏ����@�����A�v���e�N�g�E���W�X�g�E�T�[�`�n�����̂͂�
					//return obj.skill //����͖�����
				}//���Y�X�L�������Ă���
			}//�Ώۂ��X�L���������Ă��Ȃ�
		}//�Ώۂ��p�����[�^�����Ă��Ȃ�
	}//�Ώۂ����݂���
	return 0 ;//���Y�X�L���������Ă��Ȃ�
}//�X�L���J�E���g�̖{��

function skill_check(obj,skill){//�����̓G���A�������́A�L�����N�^�[,�X�L�����̕�����
//���P�̗]�n����
								var cnt = 0 ;
								if(Array.isArray(obj[e_char_def.characters])){
									switch(obj){
										case territory1 ://���̃u���b�N�͂킴��break���ĂȂ�
										case territory2 :
											for(var i=0,l=obj[e_area.Control].length;i<l;i+=1){ cnt += skill_count(obj[e_area.Control][i][e_char_def.characters],skill) ; }//�x�z�G���A���J�E���g
											for(var i=0,l=obj[e_area.Force].length;i<l;i+=1){
												for(var j=0,k=obj[e_area.Force][i].length;j<k;j+=1){ cnt += skill_count(obj[e_area.Force][i][j][e_char_def.characters],skill) ; }
											}//���̓G���A���J�E���g
											break ;
										case force_a1 ://���̃u���b�N�͂킴��break���ĂȂ�
										case force_a2 :
											for(var i=0,l=obj.length;i<l;i+=1){
												for(var j=0,k=obj[i].length;j<k;j+=1){ cnt += skill_count(obj[i][j][e_char_def.characters],skill) ; }
											}//���̓G���A���J�E���g
											break ;
										default :{
											for(var i=0,l=obj.length;i<l;i+=1){ cnt += skill_count(obj[i][e_char_def.characters],skill) ; }
											break ;}//���̑��G���A�i�x�z�G���A�j���J�E���g
									}//�w�肳�ꂽ�G���A�ɂ���L�����N�^�[�̎w�肳�ꂽ�X�L���̐���Ԃ�
								}//�Ώۂ��G���Aor�P��
								else{ cnt = skill_count(obj[e_char_def.characters],skill) ; }//�w�肳�ꂽ�L�����N�^�[�̎w�肳�ꂽ�X�L���̐���Ԃ�
								return cnt ;
//���P�̗]�n����
}//�X�L���L���E���̃`�F�b�Nojb�̓L�����N�^�[���G���A

function card_open(obj){//������card�I�u�W�F�N�g
	var idx = obj.length - 1 ;
	var ele_d = document.createElement('div');
	ele_d.className = 'area' + idx;
	var ele_i = document.createElement('img');
	ele_i.className = 'card' ;
	ele_i.src ='./Image/Saga3/aq3' + ('000' + obj[idx].No.Num).slice(-4) + '.jpg';
	ele_i.setAttribute('onClick','popUp(event,this)') ;
	ele_d.appendChild(ele_i);
	return ele_d ;
}//����J�J�[�h�̌��J����

function drow(event,obj){//�h���[�̃N���b�N�C�x���g����p
	DrowFlag = false ;
	for(var i=DrawCount;i>0;i--){
	if(game[PlayerNo-1][e_area.Deck].length){
		game[PlayerNo-1][e_area.Hand].push(game[PlayerNo-1][e_area.Deck].pop());
		var ele_h = document.getElementById("Hand_A2");
		var ele_d = card_open(game[PlayerNo-1][e_area.Hand]);//�v�f�̍쐬
		ele_h.appendChild(ele_d);//�Ō�̎q�v�f�Ƃ��Ēǉ�
	}//�f�b�L�ɃJ�[�h������
		else {alert("�h���[�ł��܂���");}
	}//1�����h���[
	close_action() ;
	event.stopPropagation(); return false;
}//�h���[����

function set(event,obj) {
	var ele_a = document.getElementsByClassName('selected');
	ele_a = ele_a[0].parentNode ;
	var idx = Number(ele_a.className.substr(4)) ;

	var Playing = {} ; Playing[ResponseCount] = game[PlayerNo-1][e_area.Hand].splice(idx,1)[0] ;
	game[PlayerNo-1][e_area.Play].push(Playing);
	console.log(game[PlayerNo-1][e_area.Play]) ;
	switch(Playing[ResponseCount].Type){
		case e_ctype.character: {break;}//�ΏۑI��s�v
		case e_ctype.breakcard://���̃u���b�N�͂킴��break���ĂȂ�
		case e_ctype.parmanent://���̃u���b�N�͂킴��break���ĂȂ�
		case e_ctype.project://���̃u���b�N�͂킴��break���ĂȂ�
		case e_ctype.fast:
			ResponseCount += 0.25;
			break ;//�ΏۑI�����K�v
		default: {break;}
	}//�J�[�h�^�C�v�ʏ���
	ResponseCount +=1 ;

	var ele_p = document.getElementById("Play_A2").firstElementChild;//Play_B�̎擾
	var ele= ele_p.getElementsByClassName("g_top") ;
	if(ele.length){
		ele[0].classList.remove('g_top');
	}//�ŐV���O��
    
	switch(Playing[Math.round(ResponseCount-1)].Type){
		case e_ctype.character:{ele_a.firstElementChild.className = 'ch_card'; break;}//�L�����N�^�[�J�[�h
		case e_ctype.breakcard:{ele_a.firstElementChild.className = 'br_card'; break;}//�u���C�N�J�[�h
		case e_ctype.parmanent:{ele_a.firstElementChild.className = 'pa_card'; break;}//�p�[�}�l���g�J�[�h
		case e_ctype.project:{ele_a.firstElementChild.className = 'pr_card'; break;}//�v���W�F�N�g�J�[�h
		case e_ctype.fast:{ele_a.firstElementChild.className = 'fa_card'; break;}//�t�@�X�g�[�J�[�h
		default: {ele_a.firstElementChild.className = 'un_card'; break;}//�s���ȃJ�[�h
	}//�J�[�h�^�C�v�̐ݒ�
	ele_a.className = 'c_set';
	ele_a.classList.add('p' + Math.round(ResponseCount-1));
	ele_a.classList.add('g_top');

	var ele_s = ele_p.lastElementChild.previousElementSibling//arrowFL�̎擾
	ele_p.insertBefore(ele_a,ele_s);

	var ele_d = document.getElementById("Hand_A2").childNodes;
	var cnt = ele_d.length;
	for(;idx<cnt;idx+=1){ ele_d[idx].className = 'area' + (idx-1); }//��D�̋󂫂��l�߂�

	close_action() ;
	event.stopPropagation(); return false;
}//�Z�b�g����

function play(event,obj) {
	set(event,obj) ;//�����̎��Ԃ�set�Ɏ���
	//close_action() ;//set���ŏ������Ă���̂ł���Ȃ�
	event.stopPropagation(); return false;
}//�v���C����

function attack(event,obj){
	var target = [] ;
	var area = [] ;
	var position = 0 ;
	var ele_attak = document.getElementsByClassName('Attacker') ;
	if(ele_attak[0].parentNode.classList.contains('Control_A')){
		area = game[PlayerNo-1][e_area.Territory][e_area.Control] ;
		position = ele_attak[0].classList.item(1).substr(4);
	}//�x�z�G���A
	else{
		area = game[PlayerNo-1][e_area.Territory][e_area.Force][ele_attak[0].parentNode.classList.item(1).substr(4)] ;
		position = ele_attak[0].classList.item(1).substr(1);
		target = game[PlayerNo-1] ;
	}//���̓G���A
	var Playing = {} ; 
	Playing[ResponseCount] = Object.assign({},area[position][e_char_def.characters]) ;
	Playing[ResponseCount].Type = 'Attack';
	Playing[ResponseCount].Area = area;
	Playing[ResponseCount].Position = position;
	Playing[ResponseCount].Target = target;
	Playing[ResponseCount].Cost = 1;
	if(!Playing[ResponseCount].Target.length){
		ResponseCount += 0.25;//�ΏۑI����
	}
	play2.push(Playing);//�A�^�b�N�錾
	console.log(Playing[Math.round(ResponseCount)]['Param']['Name']['Class'] + "��" + target + "�ɃA�^�b�N�錾���܂���") ;
	ResponseCount+=1;

	close_action() ;
	event.stopPropagation(); return false;
}//�A�^�b�N�錾����
function guard(event,obj){
	var target = [] ;
	var area = [] ;
	var position = 0 ;
	var ele_guard = document.getElementsByClassName('Guarder') ;
	if(ele_guard[0].parentNode.classList.contains('Control_A')){
		area = game[PlayerNo-1][e_area.Territory][e_area.Control] ;
		position = ele_guard[0].classList.item(1).substr(4);
	}//�x�z�G���A
	else{
		area = game[PlayerNo-1][e_area.Territory][e_area.Force][ele_guard[0].parentNode.classList.item(1).substr(4)] ;
		position = ele_guard[0].classList.item(1).substr(1);
	}//���̓G���A
	var Playing = {} ;
	Playing[ResponseCount] = Object.assign({},area[position][e_char_def.characters]) ;
	Playing[ResponseCount].Type = 'Guard';
	Playing[ResponseCount].Area = area;
	Playing[ResponseCount].Position = position;
	Playing[ResponseCount].Cost = 1;//�K�[�h�R�X�g�E�C���Z�v�����Ȃ炻�̕����Z
	play2.push(Playing);//�A�^�b�N�錾
	console.log(Playing[ResponseCount]['Param']['Name']['Class'] + "���K�[�h�錾���܂���") ;
	if(ele_guard[0].parentNode.classList.contains('Control_A')){
		ResponseCount+=0.75;
	}
	else{ ResponseCount+=1; }

	close_action() ;
	event.stopPropagation(); return false;
}//�K�[�h�錾����
function select_target(event,ojb){
	var ResCnt = Math.round(ResponseCount) ;
	var playing = {} ;
	var play = game[PlayerNo-1][e_area.Play] ;
	var l = play.length-1 ;
	do{ playing = play[l][l--]; }while(playing.hasOwnProperty(ResCnt-1)) ;//�v���C���̃J�[�h���̎擾
		
	if(playing.hasOwnProperty('Target') && !playing.Target.lenght){
		var ele_target = document.getElementsByClassName('Target') ;
		if(ele_target[0].id.substr(0,6) == 'Player'){
			playing.Target = game[PlayerNo-1] ;
		}//�v���C���[�Ώ�
		else{
			var idx = ele_target[0].parentNode.classList.item(1).substr(4) ;
			var ele_area = document.getElementById('Force_A2').getElementsByTagName('div') ;
			console.log(ele_area) ;
			ele_target[0].classList.add('Guarder') ;
			playing.Target = game[PlayerNo-1][e_area.Territory][e_area.Force][idx] ;
		}//���̓G���A�Ώ�
	}//�A�^�b�N�Ώۖ��I��
	ResponseCount -= 0.5 ;

	close_action() ;
	event.stopPropagation(); return false;
}//�Ώۂ̑I��
function pay_cost(event,obj){
	ResponseCount = Math.ceil(ResponseCount) ;

	var ele = document.getElementsByClassName('Pay') ;
	var ele_d = document.getElementById("Discard_A2").firstElementChild;//Discard_B�̎擾
	var ele_s = ele_d.lastElementChild.previousElementSibling ;//Discard_B��arrowFL���擾
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
			}//�x�����p���[�J�[�h�ł͂Ȃ�
		}//�p���[�J�[�h�̃X���C�h

		ele_d.insertBefore(ele_c,ele_s);
		ele_c.appendChild(ele[0]);
		ele[ele.length-1].className = 'card';//�v�f���ړ��������̂ňʒu���ŏ�����Ō�ɑ����Ă���
		if(ele_s.previousElementSibling.previousElementSibling){
			ele_s.previousElementSibling.previousElementSibling.classList.remove('g_top');
		}//�ŐV���O��
	}//�R�X�g�w�肳�ꂽ�J�[�h������


	var playing = {} ;
	var play = game[PlayerNo-1][e_area.Play] ;
	var l = play.length-1 ;
	do{ playing = play[l][l--]; }while(playing.hasOwnProperty(ResponseCount-1)) ;//�v���C���̃J�[�h���̎擾
	switch(playing.Type){
		case 'Attack' :{
			var ele_target = document.getElementsByClassName('Target') ;
			if(ele_target[0].id.substr(0,6) != 'Player'){
				var evt = document.createEvent("MouseEvents");
				evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				guard(evt,document.getElementById('Game')) ;
			}//���̓G���A�Ώ�
			break;}//���O�̐錾���A�^�b�N�̏ꍇ
	}

	close_action() ;
	event.stopPropagation(); return false;
}//�R�X�g�̎x��������
function set_power(event,obj) { }//���̂Ƃ���Ӗ��Ȃ�
function response_end(event,obj) {
	var Playing = [] ;
	var Guardian = {} ;
	while(play1.length){Playing.push(play1.pop());}
	while(play2.length){Playing.push(play2.pop());}
	Playing.sort(function(a,b){return (Object.keys(a)[0] > Object.keys(b)[0] ? 1 : -1);});//���F�\�[�g������
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
				console.log(character_s);//�L�����N�^�[�f�[�^�̍쐬

				var g_name = "Non_A2"; var a_name = n_a2;
				if("Era" in processing.Force) { g_name = "Era_A2" ; a_name = er_a2; }
				if("Kyo" in processing.Force) { g_name = "Kyo_A2" ; a_name = k_a2; }
				if("Dar" in processing.Force) { g_name = "Dar_A2" ; a_name = d_a2; }
				if("Wiz" in processing.Force) { g_name = "WIZ_A2" ; a_name = w_a2; }
				if("Ara" in processing.Force) { g_name = "ARA_A2" ; a_name = a_a2; }
				if("Ego" in processing.Force) { g_name = "EGO_A2" ; a_name = e_a2; }
				a_name.push(character_s) ;
				console.log(a_name);//�Z�b�g�ΏۃG���A�̑I��

				var ele_p = document.getElementById("Play_A2").firstElementChild;//Play_B�̎擾;
				var ele_t = document.getElementById(g_name);
				var ele_ps = ele_p.lastElementChild.previousElementSibling ;//arrowFL�̎擾
				var ele_ts = ele_t.lastElementChild.previousElementSibling ;//arrowFL�̎擾

				var ele = ele_t.getElementsByClassName("g_top");
				if(ele.length){
					ele[0].classList.remove('g_top');
				}//���̓g�b�v�̕ύX

				ele_ps.parentNode.firstElementChild.firstElementChild.className = ele_ps.parentNode.firstElementChild.firstElementChild.classList.item(0) + ' p0';
				if(ele_ts.previousElementSibling){
					var ele_pss = ele_ps.previousElementSibling;
					var ele_tss = ele_ts.previousElementSibling;
					ele_pss.className = ele_tss.classList.item(0) + ' p' + (Number(ele_tss.classList.item(1).substr(1)) +1) + ' g_top';
				}//��ɃZ�b�g����Ă���L�����N�^�[������Έʒu�����X�V
				ele_t.insertBefore(ele_ps.previousElementSibling,ele_ts);
				if(ele_ps.previousElementSibling){
					ele_ps.previousElementSibling.classList.add('g_top');
				}//�����҂��g�b�v�̕ύX
				break; }//�L�����N�^�[�J�[�h�̏���
			case e_ctype.breakcard :{
				console.log("Break");

				var ele = document.getElementsByClassName('Target') ;
				var idx = Number(ele[0].parentNode.parentNode.id.substr(-1)) ;//�v���C���[�i���o�[���擾
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
						idx2 = Number(ele[0].classList.item(1).substr(4)) ;//�x�z�G���A���ł̈ʒu���̎擾
						switch(g_name){
							case 'Control_A1' : { a_name = control_a1; break; }
							case 'Control_A2' : { a_name = control_a2; break; }
							default : { break ; }
						}
						break ; }//�x�z�G���A�̏ꍇ
				}//�G���A���̎擾
				if(idx2<0){
				}//���̓G���A�̏ꍇ�A���̓G���A�ł̈ʒu�����擾
				console.log('�Ώۃv���C���[',idx,'�^�[���v���C���[',PlayerNo,'�Ώۂ̃G���A���ʒu',idx2,'�Ώۂ̃G���A',g_name,'�Ώۂ̃G���A��',a_name) ;
				if(idx != PlayerNo){
					var character_g = new Array(); var break_g = new Array(); break_g.push(processing);
					var parmanent_g = new Array(); var power_g = new Array();
					var character = [break_g,character_g]; var setcard = [parmanent_g,power_g];var character_s = [Object.assign({},processing),character,setcard];
					console.log(character_s);//�L�����N�^�[�f�[�^�̍쐬
					control_a2.push(character_s) ;
					/*���̃v���C���[�������ɃL�����N�^�[�̎̂ĎD������ǉ�����*/
				}//���̃v���C���[�̃e���g���[�̃L�����N�^�[�̏ꍇ
				else{
					if(a_name !== control_a2){
						control_a2.push(a_name.splice(idx2,1)[0]) ;
						idx2 = control_a2.length - 1 ;
					}//�x�z�G���A�łȂ���Ύx�z�G���A�Ɉړ�
					control_a2[idx2][e_char_def.characters] = Object.assign({},processing) ;
					control_a2[idx2][e_char_def.character][e_char_def.break_g].push(processing) ;
					console.log(control_a2);//�Z�b�g�ΏۃG���A�̑I��
					}//�����̃e���g���[�̃L�����N�^�[�̏ꍇ

					var ele_p = document.getElementById("Play_A2").firstElementChild;//Play_B�̎擾;
					var ele_ps = ele_p.lastElementChild.previousElementSibling ;//arrowFL�̎擾
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
						}//���̓L�����N�^�[�̈ʒu�l��
					}//�����̐��̓G���A�̃L�����N�^�[�̏ꍇ
				}//�����̎x�z�G���A�ȊO�̏ꍇ
				var ele_b = ele_b.lastElementChild ;
				ele_b.className = ele_b.classList.item(0) + ' p0';
				if(ele_b.previousElementSibling && ele_b.previousElementSibling.classList.contains('br_card')){
					ele_b.className = ele_b.classList.item(0) + ' p' + (Number(ele_b.previousElementSibling.classList.item(1).substr(1)) +1);
				}//��ɃZ�b�g����Ă���u���C�N������Έʒu�����X�V

				if(ele_ps.previousElementSibling != null){
					ele_ps.previousElementSibling.classList.add('g_top');
				}//�����҂��g�b�v�̕ύX
				while(ele.length){ele[0].classList.remove('Target');} //Target�̉���

				break; }//�u���C�N�J�[�h�̏���
			case 'Attack' :{
				console.log("Attack");
				if(!Object.keys(Guardian).length){//�����K�[�h����Ă��Ȃ��ɕύX
					damege(event,player2,processing['Param']['Attack']);
				}//�o�g�����������Ă��Ȃ�
				else{
					console.log("Battle");
					if(processing['Param']['Attack'] >= Guardian['Param']['Difense']){
						var ele_Guarder = document.getElementsByClassName('Guarder') ;
						var ele_Discard = document.getElementById("Discard_A2").firstElementChild;//Discard_B�̎擾
						var ele_arrowFL = ele_Discard.lastElementChild.previousElementSibling ;//Discard_B��arrowFL���擾
						var ele_Cards = ele_Guarder[0].getElementsByClassName('pw_card');
						for(var i=ele_Cards.length-1;i>=0;i-=1){
							ele_Cards[i].src ='./Image/Saga3/aq3' + ('000' + Guardian['Area'][Guardian['Position']][e_char_def.setcard][e_char_def.power_g][i].No.Num).slice(-4) + '.jpg';
						}//�摜�̐؂�ւ��p���[�J�[�h�˒ʏ�J�[�h

						var chr = Guardian['Area'].splice(Guardian['Position'],1)[0] ;
						while(chr[e_char_def.character][e_char_def.break_g].length){ discard2.push(chr[e_char_def.character][e_char_def.break_g].pop()); }
						while(chr[e_char_def.character][e_char_def.character_g].length){ discard2.push(chr[e_char_def.character][e_char_def.character_g].pop()); }
						while(chr[e_char_def.setcard][e_char_def.parmanent_g].length){ discard2.push(chr[e_char_def.setcard][e_char_def.parmanent_g].pop()); }
						while(chr[e_char_def.setcard][e_char_def.power_g].length){
							discard2.push(chr[e_char_def.setcard][e_char_def.power_g].pop());
							discard2[discard2.length-1].Type *= -1;
						}//�p���[�J�[�h�˒ʏ�J�[�h�ϊ�

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
							}//�ŐV���O��
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
						}//�G���A�̈ʒu�l����
						if(ele_Area.id != 'Control_A2'){
							if(ele_Area_div.length){
								ele_Area_div[ele_Area_div.length-1].classList.add('g_top') ;
							}
						}
					}//�A�^�b�N�˃K�[�h����
					if(Guardian['Param']['Attack'] >= processing['Param']['Difense']){
						var ele_Attacker = document.getElementsByClassName('Attacker') ;
						var ele_Discard = document.getElementById("Discard_A2").firstElementChild;//Discard_B�̎擾
						var ele_arrowFL = ele_Discard.lastElementChild.previousElementSibling ;//Discard_B��arrowFL���擾
						var ele_Cards = ele_Attacker[0].getElementsByClassName('pw_card');
						for(var i=ele_Cards.length-1;i>=0;i-=1){
							ele_Cards[i].src ='./Image/Saga3/aq3' + ('000' + processing['Area'][processing['Position']][e_char_def.setcard][e_char_def.power_g][i].No.Num).slice(-4) + '.jpg';
						}//�摜�̐؂�ւ��p���[�J�[�h�˒ʏ�J�[�h

						var chr = processing['Area'].splice(processing['Position'],1)[0] ;

						while(chr[e_char_def.character][e_char_def.break_g].length){ discard2.push(chr[e_char_def.character][e_char_def.break_g].pop()); }
						while(chr[e_char_def.character][e_char_def.character_g].length){ discard2.push(chr[e_char_def.character][e_char_def.character_g].pop()); }
						while(chr[e_char_def.setcard][e_char_def.parmanent_g].length){ discard2.push(chr[e_char_def.setcard][e_char_def.parmanent_g].pop()); }
						while(chr[e_char_def.setcard][e_char_def.power_g].length){
							discard2.push(chr[e_char_def.setcard][e_char_def.power_g].pop());
							discard2[discard2.length-1].Type *= -1;
						}//�p���[�J�[�h�˒ʏ�J�[�h�ϊ�

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
							}//�ŐV���O��
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
						}//�G���A�̈ʒu�l����
						if(ele_Area.id != 'Control_A2'){
							if(ele_Area_div.length){
								ele_Area_div[ele_Area_div.length-1].classList.add('g_top') ;
							}
						}
					}//�K�[�h�˃A�^�b�N����
				}//�o�g�����������Ă���
				break;}//�A�^�b�N�������̏���
			case 'Guard' :{
				console.log("Guard");
				Guardian = processing ;
				break; }//�K�[�h�������̏���
			case 'Battle' :{ break; }//�o�g���������̏���
			default:{ break; }
		}
		console.log('���������J�[�h',processing);
		console.log('�������̃J�[�h',Playing);
		console.log('������̑ΏۃG���A�̏�',a_name);
	}
	var ele = document.getElementsByClassName('Target') ; while(ele.length){ele[0].classList.remove('Target');}
	ele = document.getElementsByClassName('Attacker') ; while(ele.length){ele[0].classList.remove('Attacker');}
	var ele = document.getElementsByClassName('Guarder') ; while(ele.length){ele[0].classList.remove('Guarder');}
	close_action() ;
	event.stopPropagation(); return false;
}//���X�|���X�̉�������
function damege(event,obj,value){
	interval_cnt = value ;
	interval_id = setInterval(function(){
		var ele_a = card_open(obj[e_area.Deck]) ;//Play�̈悪����Ȃ̂Ő�Ɍ��J���̕\�������擾���Ă���
		var check = obj[e_area.Deck].pop() ;
		if(check && obj[e_area.Damege].length < Damege_Max){
			console.log(check);
			switch(check.Type){
				case e_ctype.character :{
					var Playing = {} ; Playing[ResponseCount] = check ;
					play2.push(Playing);
					ResponseCount+=1 ;

					var ele_p = document.getElementById("Play_A2").firstElementChild;//Play_B�̎擾
					var ele= ele_p.getElementsByClassName("g_top") ;
					if(ele.length){
						ele[0].classList.remove('g_top');
					}//�ŐV���O��
					ele_a.firstElementChild.className = 'ch_card';
					ele_a.className = 'c_set';
					ele_a.classList.add('p' + Math.round(ResponseCount-1));
					ele_a.classList.add('g_top');
					var ele_s = ele_p.lastElementChild.previousElementSibling//arrowFL�̎擾
					ele_p.insertBefore(ele_a,ele_s);
					console.log(ele_p) ;
					response_end(event,obj) ;
					break ; }//�L�����N�^�[�͐��̓G���A�ɃZ�b�g�����
				default :{
					damege2.push(check) ;

					var ele_d =  card_open(obj[e_area.Damege]) ;
					var ele_p = document.getElementById("Damege_A2");
					ele_p.appendChild(ele_d);
					break; }//����ȊO�̓_���[�W�u�����
			}//�J�[�h�^�C�v���̏���
		}//�f�b�L�ɃJ�[�h���c���Ă��邩�_���[�W����łȂ�
		if(obj[e_area.Damege].length >= Damege_Max){
			alert("�_���[�W������ɒB���܂����B");
			clearInterval(interval_id);
			interval_id = null ;
		}
		if(--interval_cnt == 0){clearInterval(interval_id); interval_id = null ;}
	},500) ;//�󂯂����l���������J��Ԃ�
}//�_���[�W����

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
		}//���L��
	}//���̓G���A�ɃL�����N�^�[������
	ForceCount += 1 ;
	document.getElementById("forcecheck").innerHTML = Force_Name[ForceCount] + "���̓`�F�b�N" ;

	close_action() ;
	event.stopPropagation(); return false;
}//���̓O���[�v�̃A�O���b�V�u�`�F�b�N
function phase_start(event,obj) {
	PhaseStart= true ;

    close_action() ;
    event.stopPropagation(); return false;
}//�t�F�C�Y�J�n���̏���
function phase_end(event,obj) {
	PhaseStart= false ;
	var p_text = "�t�F�C�Y";
	switch(++PhaseCount){
		case e_phase.Drow:{
			DrowFlag = true ;
			DrawCount = 1 + skill_check(game[PlayerNo-1][e_area.Territory][e_area.Control],'Draw') ;//�h���[���̌���
			console.log('�h���[����',DrawCount) ;
			//skill_check(game[i][e_area.Territory][e_area.Control],skill) ;//�����[�u���̌���i�X�L���������ɂ��R�����g�A�E�g���j
			p_text = "�h���[" + p_text ;
			break ; }//�^�[���I�����̏���
		case e_phase.Aggressive:{
			ForceCount = 0 ;
			document.getElementById("forcecheck").innerHTML = Force_Name[ForceCount] + "���̓`�F�b�N" ;
			p_text = "����" + p_text ;
			break ; }//�h���[�t�F�C�Y�I�����̏���
		case e_phase.Main:{
			p_text = "���C��" + p_text ;
			break ; }//���̓t�F�C�Y�I�����̏���
		case e_phase.Power:{
			ChargeCount = skill_check(game[PlayerNo-1][e_area.Territory][e_area.Control],'Charge') ;//�`���[�W���̌���
			console.log('�`���[�W����',ChargeCount) ;
			p_text = "�p���[�J�[�h" + p_text ;
			break ; }//���C���t�F�C�Y�I�����̏���
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
			});//���ɓ���Ă������p���[�J�[�h�̎��W
			darray.sort(function(a,b) { return (a.Date > b.Date ? 1 : -1); });//�Z�b�g���ꂽ�̂��Â����Ƀ\�[�g
			for (key1 in darray){
				var card_d = deck2.pop() ;
				card_d.Type *= -1 ;
				for(key2 in card_d){
					Object.defineProperty(darray[key1],key2,{value :card_d[key2],writable : true,enumerable : true,configurable : true}) ;
				}//�f�b�L�g�b�v�̏��ŉ������A�b�v�f�[�g
				delete darray[key1].Date ;
			}//���p���[�J�[�h�𐳋K�̃p���[�J�[�h��
            
			var ele = document.getElementById('Player2').getElementsByClassName('pw_card') ;
			console.log(ele);
			for(var i=0;i<ele.length;i++){
				if( ele[i].classList.item(1).match(/[io]/)){
					console.log(ele[i].classList);
					if(ele[i].classList.item(1).charAt(0)== 'o'){
						ele[i].src = "./Image//Saga3/card_power.gif";
					}//���ʉ摜��
					if(ele[i].parentNode.firstChild.classList.contains('pw_card')){
						ele[i].className = ele[i].classList.item(0) + ' u' + (Number(ele[i].parentNode.firstChild.classList.item(1).substr(1))+1) ;
					}
					else{
						ele[i].className = ele[i].classList.item(0) + ' u' + (Number(ele[i].classList.item(1).substr(1))) ;
					}
					ele[i].parentNode.insertBefore(ele[i], ele[i].parentNode.firstChild);
				}//���̃^�[���Z�b�g�����p���[�J�[�h
			}//�p���[�J�[�h���L�����N�^�[�̉��ֈړ�
            
			game[PlayerNo-1][e_area.Territory][e_area.Force].forEach(function(e,i){
				if(e.length){
					if(e[e.length-1][e_char_def.setcard][e_char_def.power_g].length == e[e.length-1][e_char_def.characters].Param.Mind){
						game[PlayerNo-1][e_area.Territory][e_area.Control].push(e.pop()) ;

						var sel = sel_Array[PlayerNo-1][i] ;
						ele_c = document.getElementById(sel).getElementsByClassName('c_set') ;
						if(ele_c.length){
							ele_c[ele_c.length-1].className = 'c_set area' + (control_a2.length-1) ;
							document.getElementById('Control_A2').appendChild(ele_c[ele_c.length-1]) ;
						}//�x�z�G���A�Ɉړ�
						if(ele_c.length){ ele_c[ele_c.length-1].classList.add('g_top') ; }//�A�N�e�B�u�L�����N�^�[�̕ύX
					}//�x�z�ł���Ύx�z����
				}//���̓O���[�v�ɃL�����N�^�[������
			});//���̓O���[�v�S�Ă��`�F�b�N
			Hand_Max = 7 + skill_check(game[PlayerNo-1][e_area.Territory][e_area.Control],'Capacity') ;//�L���p�V�e�B���̌���
			if(Hand_Max < hand2.length){ DiscardFlag = true ; }//��D�������K�v��
			console.log('��D�����',Hand_Max) ;
			p_text = "�f�B�X�J�[�h" + p_text ;
			break ; }//�p���[�J�[�h�t�F�C�Y�I�����̏���
        default :{
			var ele_d = document.getElementById("Discard_A2").firstElementChild;
			var ele_s = ele_d.lastElementChild.previousElementSibling ;
			var ele = document.getElementsByClassName('dr_card');
			while(ele.length){
				console.log(ele) ;
				var idx = ele[0].parentNode.className.substr(4) ;
				console.log('��D�ʒu',idx) ;
				game[PlayerNo-1][e_area.Discard].push(game[PlayerNo-1][e_area.Hand].splice(idx,1)[0]) ;

				ele[0].parentNode.className = 'dis p' + (game[PlayerNo-1][e_area.Discard].length ? game[PlayerNo-1][e_area.Discard].length-1 : 0);
				ele_d.insertBefore(ele[0].parentNode,ele_s);
				ele[ele.length-1].className = 'card';

				var ele_h = document.getElementById("Hand_A2").childNodes;
				var cnt = ele_h.length ;
				for(var i=0;i<cnt;i+=1){ele_h[i].className = 'area' + (i-1);}
            }//��D�̎̂ĎD����
			var ele_g = ele_d.getElementsByClassName('g_top') ;
			if(ele_g.length){ele_g[0].classList.remove('g_top');}
			if(ele_d.lastElementChild.previousElementSibling.previousElementSibling){
				ele_d.lastElementChild.previousElementSibling.previousElementSibling.classList.add('g_top');
			}
			PhaseStart= true ;//�^�[���G���h�ɊJ�n�錾�͂Ȃ��̂Ńt���O��^�ɐݒ�
			break ; }//�f�B�X�J�[�h�t�F�C�Y�I�����̏���
	}//�t�F�C�Y���̏���
	document.getElementById("start_declaration").innerHTML = p_text+ "�J�n";
	document.getElementById("end_declaration").innerHTML = p_text + "�I��";

	for(var i=game.length-1;i>=0;i-=1){
		for(var j=sel_Array[i].length-1;j>=0;j-=1){
			var ele_g_top = document.getElementById(sel_Array[i][j]).getElementsByClassName('g_top') ;
			while(ele_g_top.length){
				ele_g_top[0].classList.remove('g_top')
			}
			var ele_div =  document.getElementById(sel_Array[i][j]).getElementsByTagName('div') ;
			if(ele_div.length) {ele_div[ele_div.length-1].classList.add('g_top') }
		}//���̓g�b�v��\��
	}//�e�v���C���[�̗̈�Ɏ��{

	close_action() ;
	event.stopPropagation(); return false;
}//�t�F�C�Y�I�����̏���
function turn_end(event,obj) {
	TurnCount++;
	PhaseCount = e_phase.Drow-1 ;//�v���C���N�������g���Ă���̂ŁA�h���[�̂ЂƂO��n��
	phase_end(event,obj) ;//���ۂ̏�����Phase_end�Ŏ��{

	close_action() ;
	event.stopPropagation(); return false;
}//�^�[���I�����̏���

function check_sub(obj,actPlayer){
	if(actPlayer != PlayerNo && obj[e_char_def.setcard][e_char_def.power_g].length != 0){return null;}
	return obj[e_char_def.characters];
}//�Ώۂ̎擾�B���łɉ���茩�z���ēK���`�F�b�N��

function I_check(obj){
	var chr = {};
	var Icon_Array = Object.keys(obj.Icon) ;//�A�C�R���I�u�W�F�N�g�̔z��
	console.log('�v���C�������J�[�h�̃A�C�R����' + Icon_Array) ;
	
	for(var i=0,l=game.length;i<l;i+=1){
		var Icon_Game = [];
		for(var j=0,m=game[i][e_area.Territory][e_area.Force].length;j<m;j+=1){
			Icon_Game.push.apply(Icon_Game,game[i][e_area.Territory][e_area.Force][j]);
		}
		Icon_Game.push.apply(Icon_Game,game[i][e_area.Territory][e_area.Control]) ;
		if(Icon_Game.some(function(target){
			if(chr = check_sub(target,i+1)){
				console.log('�`�F�b�N���̑Ώۂ̏����A�C�R����' + Object.keys(chr.Icon)) ;
				if(Icon_Array.some(function(Key){
					return (Key in chr.Icon) ;
				})){return true;}
			}
		})){return true;}
	}//�e�v���C���[�̃e���g���[���`�F�b�N
	return false ;
}//�A�C�R���`�F�b�N

function C_check(obj){
	var i_Cost = 0 ;
	game[PlayerNo-1][e_area.Territory][e_area.Control].forEach(function(e){i_Cost += e[e_char_def.setcard][e_char_def.power_g].length}) ;
	console.log('���݁A�g�p�\�ȃp���[�J�[�h��' + i_Cost + '����' + my_object_values(obj.Param.Name) + '�̕K�v�R�X�g��' + obj.Cost + '�ł��B') ;
	if(i_Cost >= obj.Cost){return true ;}
	return false ;
}//�R�X�g�`�F�b�N

function Corect_F(d_array,obj,n){
	var keys = Object.keys(obj) ;
	for( var i=0, l=keys.length; i<l; i+=1) { d_array[card.Force[keys[i]]] += n * obj[keys[i]]; }
}//�t�@�N�^�[���̎��W

function F_check(obj){
	var F_Array = Array.apply(null,Array(Math.max.apply(null, my_object_values(card.Force)))).map(function(){ return 0 }) ;
	game[PlayerNo-1][e_area.Territory][e_area.Control].forEach(function(e){Corect_F(F_Array,check_sub(e,PlayerNo).Force,+1);});//�����t�@�N�^�[�����W
	console.log('���݂̃t�@�N�^�[��' + F_Array + '�ł�') ;
	Corect_F(F_Array,obj.Facter,-1);//���Z�ŕK�v�t�@�N�^�[�������W
	if(Math.min.apply(null, F_Array) >= 0){return true ;}//�ŏ��l��0�ȏ�Ȃ�t�@�N�^�[OK
	return false ;
}//�t�@�N�^�[�̃`�F�b�N

function my_object_values(obj) {
	var a = [] ;
	for (var p in obj){ a.push(obj[p]); }
	return a;
};//Object.values�̑�p

function popUp(event,obj) {
	console.log(obj.classList,TurnCount,PhaseCount,ResponseCount) ;
	var disp_array = [] ;
	var act = document.getElementById("Action");
	var cnt = act.childNodes.length;
	for(cnt--;cnt>=0;cnt--){
		act.childNodes[cnt].className='d_none';
	}//�A�N�V�����̑S�v�f�̔�\����
	console.log('�Q�[����',game) ;
	if(interval_id) { return false ; }//�^�C�}�[���쒆�͑�����󂯕t���Ȃ�

	if(!PhaseStart){ disp_array.push(document.getElementById("start_declaration")); }//�t�F�C�Y���J�n���Ă��Ȃ�
	else {
		switch (obj.parentNode.id){
			case "Deck_A2":{
				switch(PhaseCount){
					case e_phase.Drow:{
						if(DrowFlag){ disp_array.push(document.getElementById("drow"));}//�h���[���܂�
						break; }//�h���[�t�F�C�Y
					case e_phase.Power:{
						var ele = document.getElementsByClassName("active");
						if(ele.length && ChargeCount > 0) {
							var idx = 0 ; var idx2 = 0 ; var to = [] ;
							if(ele[0].parentNode.classList.contains('Control_A')){
								idx = ele[0].classList.item(1).substr(4) ;
								to = game[PlayerNo-1][e_area.Territory][e_area.Control][idx] ;
							}
							else{
								if(!ele[0].classList.contains('g_top')){break;}//�p���[�J�[�h���Z�b�g�\�ȑΏۂł͂Ȃ�
								idx = ele[0].parentNode.classList.item(1).substr(4) ;
								idx2 = ele[0].classList.item(1).substr(1) ;
								to = game[PlayerNo-1][e_area.Territory][e_area.Force][idx][idx2] ;
							}
							if(to[e_char_def.setcard][e_char_def.power_g].length < to[e_char_def.characters].Param.Mind){
								ChargeCount-- ;
								to[e_char_def.setcard][e_char_def.power_g].push({Date:Date.now()}) ;//���Ԃ𔻒�\�ȃ_�~�[�f�[�^��u���Ă���

								var ele_d = document.createElement('img');
								ele_d.setAttribute("onClick","popUp(event,this)") ;
								ele_d.src = "./Image//Saga3/card_power.gif";
								var ele_l = ele[0].lastElementChild ;
								var ele_pw = ele[0].getElementsByClassName('pw_card') ;
								if(ele_pw.length){
									ele_d.className = 'pw_card i' + ele_pw.length ;
								}//���̃J�[�h���Z�b�g����Ă��� 
								else { ele_d.className = 'pw_card i0' ; }//���ɃJ�[�h���Z�b�g����Ă��Ȃ�

								ele[0].appendChild(ele_d);
							}//�p���[�J�[�h���Z�b�g�ł���
						}//�`���[�W�c�ʂ�����A�p���[�J�[�h���Z�b�g����Ώۂ��I������Ă���
						break ; }//�p���[�J�[�h�t�F�C�Y
					default :{ break; }//���̑��̃t�F�C�Y
				}//�t�F�C�Y���̏���
				break; }//�f�b�L
			default :{
				switch (obj.parentNode.parentNode.id){
					case "Hand_A2":{
						var idx = obj.parentNode.className.substr(4) ;
						var hands = game[PlayerNo-1][e_area.Hand]
						switch(PhaseCount){
							case e_phase.Main:{
								switch(hands[idx].Type) {
									case e_ctype.breakcard :{}//�u���C�N�J�[�h�@���F���̃u���b�N�͂킴��break���ĂȂ�
									case e_ctype.parmanent :{
										if(!F_check(hands[idx]) || !C_check(hands[idx]) || !I_check(hands[idx])){break;}//�g�p�����𖞂����Ă��Ȃ�
										}//�p�[�}�l���g�J�[�h�@���F���̃u���b�N�͂킴��break���ĂȂ�
									case e_ctype.character :{
										if(ResponseCount != 0){ break; }//�g�p�^�C�~���O�s�K��
										disp_array.push(document.getElementById("set"));
										break ; }//�L�����N�^�[�J�[�h
									case e_ctype.project :{
										if(ResponseCount != 0){ break; }//�g�p�^�C�~���O�s�K��
										}//�v���W�F�N�g�J�[�h�@���F���̃u���b�N�͂킴��break���ĂȂ�
									case e_ctype.fast :{
										disp_array.push(document.getElementById("play"));
										break ; }//�t�@�X�g�J�[�h
									default :{ break; }//����ȊO�̃J�[�h
								}//�J�[�h�^�C�v���̏���
								break ; }//���C���t�F�C�Y
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
											if(!ele[0].classList.contains('g_top')){break;}//�p���[�J�[�h���Z�b�g�\�ȑΏۂł͂Ȃ�
											idx = ele[0].parentNode.classList.item(1).substr(4) ;
											idx2 = ele[0].classList.item(1).substr(1) ;
											to = game[PlayerNo-1][e_area.Territory][e_area.Force][idx][idx2] ;
										}
										if(to[e_char_def.setcard][e_char_def.power_g].length < to[e_char_def.characters].Param.Mind){
											from[idx3].Type *= -1;//�J�[�h�^�C�v���p���[�J�[�h�֕ύX ;
											to[e_char_def.setcard][e_char_def.power_g].push(from.splice(idx3,1)[0]) ;

											var ele_l = ele[0].lastElementChild ;
											var ele_pw = ele[0].getElementsByClassName('pw_card') ;
											if(ele_pw.length){
												obj.className = 'pw_card o' + ele_pw.length ;
											}//���̃J�[�h���Z�b�g����Ă��� 
											else { obj.className = 'pw_card o0' ; }//���ɃJ�[�h���Z�b�g����Ă��Ȃ�

											var ele_p = obj.parentNode
											for(var ele_c = ele_p.parentNode.lastElementChild;ele_c != ele_p;ele_c = ele_c.previousElementSibling){
												ele_c.className = ele_c.previousElementSibling.className ;
											}//�J�[�h�ʒu�̃X���C�h
											ele_p.parentNode.removeChild(ele_p);
											ele[0].appendChild(obj);
										}//�p���[�J�[�h���Z�b�g�ł���
									}//�p���[�J�[�h���Z�b�g����Ώۂ��I������Ă���
								break ; }//�p���[�J�[�h�t�F�C�Y
							case e_phase.Discard:{
								var from = game[PlayerNo-1][e_area.Hand];
								if(Hand_Max < from.length){
									obj.classList.toggle('dr_card') ;
									if(Hand_Max == from.length - document.getElementsByClassName('dr_card').length ){ DiscardFlag = false ; }//��DOK
									else{ DiscardFlag = true ; }//��DNG
								}//��D�I�[�o�[
								break ; }//�f�B�X�J�[�h�t�F�C�Y
							default:{ break ; }//���̑��̃t�F�C�Y
						}//�t�F�C�Y���̏���
						break ; }//��D
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
									var idx = obj.parentNode.parentNode.classList.item(1).substr(4) ;//�Ώۂ̐��̓G���A
									var idx2 = obj.parentNode.classList.item(1).substr(1) ;//�Ώۂ̐��̓G���A���ł̈ʒu
									var playing = {} ;
									var l = game[PlayerNo-1][e_area.Play].length-1 ;
									do{ playing = game[PlayerNo-1][e_area.Play][l][l--]; }while(playing.hasOwnProperty(ResCnt)) ;//�v���C���̃J�[�h���̎擾
									switch(playing.Type){
										case e_ctype.breakcard :{
											var chr = check_sub(force_a2[idx][idx2],PlayerNo) ;
											console.log('�Ώۂ̃L�����N�^�[�͐��̓G���A',idx,'��',idx2,'�Ԗڂ̃L�����N�^�[',chr) ;
											if(chr){
												var Icon_Array = [] ;
												for(name in playing.Icon){Icon_Array.push(name);}
												console.log('�ڕW�̃A�C�R��',chr.Icon,'�v���C���̃J�[�h�̃A�C�R��',Icon_Array) ;
												if(Icon_Array.some(function(Key){if(Key in chr.Icon){return true;}})){
													obj.parentNode.classList.toggle('Target') ;
												}//�ΏۂɑI��
											}//�K���ȃu���C�N�Ώ�
											break ; }//�u���C�N�J�[�h���v���C��
										case 'Attack' :{
											var chr = check_sub(force_a2[idx][idx2],PlayerNo) ;
											console.log('�Ώۂ̃L�����N�^�[�͐��̓G���A',idx,'��',idx2,'�Ԗڂ̃L�����N�^�[',chr) ;
											if(chr && idx2 == force_a2[idx].length-1){
												obj.parentNode.classList.toggle('Target') ;//�ΏۂɑI��
											}//�K���ȃA�^�b�N�Ώ�
											break ; }//�u���C�N�J�[�h���v���C��
										default:{ break; }//����ȊO�̉������v���C��
									}//�v���C���Ă���J�[�h���̏���
								}//�ΏۑI��
								if(ResCnt == ResponseCount){
									if(obj.classList.contains('ch_card') || obj.classList.contains('br_card') ){
										if(ResponseCount != 0){
											var playing = {} ;
											var l = game[PlayerNo-1][e_area.Play].length-1 ;
											do{ playing = game[PlayerNo-1][e_area.Play][l][l--]; }while(playing.hasOwnProperty(ResCnt)) ;//�v���C���̃J�[�h���̎擾
											switch(playing.Type){
												case 'Attack' :{
													var chr = check_sub(force_a2[idx][idx2],PlayerNo) ;
													console.log('�Ώۂ̃L�����N�^�[�͐��̓G���A',idx,'��',idx2,'�Ԗڂ̃L�����N�^�[',chr) ;
													if(chr && idx2 == force_a2[idx].length-1){
														obj.parentNode.classList.toggle('Target') ;//�ΏۂɑI��
													}//�K���ȃA�^�b�N�Ώ�
													break ; }//�u���C�N�J�[�h���v���C��
												default:{
													obj.parentNode.classList.toggle('Target') ;//�Ώۂ̑I���E����
													break; }//����ȊO�̉������v���C��
											}//�v���C���Ă���J�[�h���̏���
										}//�A�^�b�N�錾�\�ȃ^�C�~���O
									}//�L�����N�^�[���u���C�N
								}//���X�|���X��
								break ; }//���C���t�F�C�Y
							case e_phase.Power:{
								if(obj.classList.contains('pw_card') && obj.classList.item(1).match(/[io]/)){
									for(var ele = obj.parentNode.lastElementChild;ele != obj;ele = ele.previousElementSibling){
										ele.className = 'pw_card ' +  ele.classList.item(1).charAt(0) + ele.previousElementSibling.classList.item(1).substr(1) ;
									}//�p���[�J�[�h�̈ʒu�Â�
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
											break ;}//��D����Z�b�g���Ă����ꍇ
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
											break ; }//�`���[�W�̏ꍇ
										default : { break ; }//����ȊO
									}//��Dor�`���[�W
								}//�Z�b�g���悤�Ƃ��Ă���J�[�h
								else {
									if(obj.parentNode.nextElementSibling.className == "arrowFL"){
										var ele = document.getElementsByClassName("active");
										while(ele.length){
											ele[0].classList.remove('active');
										}
										obj.parentNode.classList.add('active') ;
									}
								}
								break ; }//�p���[�J�[�h�t�F�C�Y
							default:{ break ; }//����ȊO�̃t�F�C�Y
						}
						break ; }//���̓G���A
					case "Control_A2":{
						console.log("Control_A2") ;
						switch(PhaseCount){
							case e_phase.Aggressive:{
								var ResCnt = Math.round(ResponseCount) ;
								if(ResCnt > ResponseCount){
									if(obj.classList.contains('pw_card')){
										if(obj.parentNode.classList.contains('Guarder')){
											obj.classList.toggle('Pay') ;
										}//�Ώۂ��K�[�h�錾���Ă��邩�H
									}//�Ώۂ��p���[�J�[�h
								}//�R�X�g�x����
								if(ResCnt == ResponseCount){
									if(obj.classList.contains('ch_card') || obj.classList.contains('br_card') ){
										var ele_pw = obj.parentNode.getElementsByClassName('pw_card') ;
										if(ele_pw.length){
											if(ResponseCount == 1 && game[PlayerNo-1][e_area.Play][0][0].Type == 'Attack'){
												obj.parentNode.classList.toggle('Guarder') ;//�Ώۂ̑I���E����
													if(obj.parentNode.classList.contains('Guarder')){
														disp_array.push(document.getElementById("guard"));
													}//���󕡐��K�[�hOK�����A�V�X�e���I�ɂ��蓾��̂ł��̂܂�
												}//�K�[�h�錾�\�ȃ^�C�~���O
											//if(�G�t�F�N�g�������Ă���)//�G�t�F�N�g����������
										}//�p���[�J�[�h������@�C���^�[�Z�v�g�͕ʘg�H�N���X�ŃC���^�[�Z�v�g�������Ă����H
									}//�L�����N�^�[���u���C�N
								}//���X�|���X��
								break; }
							case e_phase.Main:{
								var ResCnt = Math.round(ResponseCount) ;
								if(ResCnt < ResponseCount){
									var playing = {} ;
									var l = game[PlayerNo-1][e_area.Play].length-1 ;
									do{ playing = game[PlayerNo-1][e_area.Play][l][l--]; }while(playing.hasOwnProperty(ResCnt)) ;//�v���C���̃J�[�h���̎擾
									switch(playing.Type){
										case e_ctype.breakcard :{
											if(obj.classList.contains('ch_card') || obj.classList.contains('br_card') ){
												var idx = obj.parentNode.classList.item(1).substr(4) ;
												var chr = check_sub(control_a2[idx],PlayerNo) ;
												console.log('�Ώۂ̃L�����N�^�[�͎x�z�G���A��',idx,'�Ԗڂ̃L�����N�^�[',chr) ;
												if(chr){
													var Icon_Array = [] ;
													for(name in playing.Icon){Icon_Array.push(name);}
													console.log('�ڕW�̃A�C�R��',chr.Icon,'�v���C���̃J�[�h�̃A�C�R��',Icon_Array) ;
													if(Icon_Array.some(function(Key){if(Key in chr.Icon){return true;}})){
														obj.parentNode.classList.toggle('Target') ;
													}//�ΏۂɑI��
												}//�K���ȃu���C�N�Ώ�
											}//�Ώۂ��L�����N�^�[���u���C�N
											break ; }//�u���C�N�J�[�h���v���C��
										default:{ break; }//����ȊO�̉������v���C��
									}//�v���C���Ă���J�[�h���̏���
								}//�ΏۑI��
								if(ResCnt > ResponseCount){
									var idx = obj.parentNode.classList.item(1).substr(4) ;//�Ώۂ̎x�z�G���A���ł̈ʒu
									var playing = {} ;
									var l = game[PlayerNo-1][e_area.Play].length-1 ;
									do{ playing = game[PlayerNo-1][e_area.Play][l][l--]; }while(playing.hasOwnProperty(ResCnt-1)) ;//�v���C���̃J�[�h���̎擾
									console.log('���݃v���C���Ȃ̂�' + playing.Type + '�ł�')
									switch(playing.Type){
										case 'Attack' :{
											if(obj.classList.contains('pw_card')){
												if(obj.parentNode.classList.contains('Attacker')){
													obj.classList.toggle('Pay') ;
												}//�Ώۂ��A�^�b�N�錾���Ă��邩�H
											}//�Ώۂ��p���[�J�[�h
											break ; }//�A�^�b�N�錾��
										default:{
											if(obj.classList.contains('pw_card')){
												obj.classList.toggle('Pay') ;
											}//�Ώۂ��p���[�J�[�h
										 break; }//����ȊO�̉������v���C��
									}//�v���C���Ă���J�[�h���̏���
								}//�R�X�g�x����
								if(ResCnt == ResponseCount){
									if(obj.classList.contains('ch_card') || obj.classList.contains('br_card') ){
										var ele_pw = obj.parentNode.getElementsByClassName('pw_card') ;
										if(ele_pw.length){
											switch(ResCnt){
											case 0 :{
												obj.parentNode.classList.toggle('Attacker') ;//�Ώۂ̑I���E����
												if(obj.parentNode.classList.contains('Attacker')){
													disp_array.push(document.getElementById("attack"));
												}//���󕡐��A�^�b�NOK�����A�V�X�e���I�ɂ��蓾��̂ł��̂܂�
												break; }
											case 1 :{
												if(game[PlayerNo-1][e_area.Play][0][0]  == 'Attack'){
													obj.parentNode.classList.toggle('Guarder') ;//�Ώۂ̑I���E����
													if(obj.parentNode.classList.contains('Guarder')){
														disp_array.push(document.getElementById("guard"));
													}//���󕡐��K�[�hOK�����A�V�X�e���I�ɂ��蓾��̂ł��̂܂�
												}//�ŏ��Ƀv���C���ꂽ�̂��A�^�b�N�錾�̏ꍇ
												break; }
											default : {break;}//����ȍ~�̃��X�|���X
											}//���X�|���X�^�C�~���O
											//if(�G�t�F�N�g�������Ă���)//�G�t�F�N�g����������
										}//�p���[�J�[�h������@�C���^�[�Z�v�g�͕ʘg�H
									}//�L�����N�^�[���u���C�N
								}//���X�|���X��
								break ; }//���C���t�F�C�Y
							case e_phase.Power:{
								if(obj.classList.contains('pw_card') && obj.classList.item(1).match(/[io]/)){
									for(var ele = obj.parentNode.lastElementChild;ele != obj;ele = ele.previousElementSibling){
										ele.classList.item(1) =ele.classList.item(1).charAt(0) +ele.previousElementSibling.classList.item(1).substr(1) ;
									}//�p���[�J�[�h�̈ʒu�Â�
									var ele = obj.parentNode ;
									var idx = ele.classList.item(1).substr(4) ;
									var idx2 = obj.classList.item(1).substr(1) ;
									switch(obj.classList.item(1).charAt(0)){
										case 'i':{
											ChargeCount++ ;
											var from = game[PlayerNo-1][e_area.Territory][e_area.Control][idx] ;
											from[e_char_def.setcard][e_char_def.power_g].splice(idx2,1);

											obj.parentNode.removeChild(obj) ;
											break ;}//��D����Z�b�g���Ă����ꍇ
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
											break ; }//�`���[�W�̏ꍇ
										default : { break ; }//����ȊO
									}//��Dor�`���[�W
								}//�Z�b�g���悤�Ƃ��Ă���J�[�h
								else {
									var ele = document.getElementsByClassName("active");
									while(ele.length){ele[0].classList.remove('active'); }
									obj.parentNode.classList.add('active') ;
								}//�p���[�J�[�h�Z�b�g�Ώۂ�ύX
								break ; }//�p���[�J�[�h�t�F�C�Y
							default:{ break ; }//����ȊO�̃t�F�C�Y
						}//�t�F�C�Y���̏���
						break ; }//�x�z�G���A�̏���
					default:{
						console.log("Game") ;
						var ResCnt = Math.round(ResponseCount) ;
						if(ResponseCount > ResCnt){
							if(document.getElementsByClassName('Target').length == iTargets){ disp_array.push(document.getElementById("target"));}//�Ώې��K��
						}//�ΏۑI��
						if(ResponseCount < ResCnt){
							if(play2[ResCnt-1][ResCnt-1].Cost == document.getElementsByClassName('Pay').length){
								disp_array.push(document.getElementById("paycost"));
							}//�K���R�X�g
						}//�R�X�g�x����
						if(ResponseCount == ResCnt){
							if(ResponseCount != 0){ disp_array.push(document.getElementById("response")); } //���X�|���X��
							else {
								if(PhaseCount == e_phase.Aggressive && (ForceCount < force_a2.length-1 || (ForceCount == force_a2.length-1 && force_a2[e_area.Non].length))){ disp_array.push(document.getElementById("forcecheck")); }//���̓`�F�b�N��
								else {
									if(!DrowFlag && !DiscardFlag){
										if(PhaseCount <= e_phase.Discard){ disp_array.push(document.getElementById("end_declaration")); }//�f�B�X�J�[�h�t�F�C�Y���I�����Ă��Ȃ�
										else { disp_array.push(document.getElementById("turn")); }//�f�B�X�J�[�h�t�F�C�Y���I�����Ă��遁�^�[���I��
									}//�h���[���ĂȂ�or��D�I�[�o�[�łȂ�
								}//
								}//���X�|���X�����ς�
							}//�ΏۑI���E�R�X�g�x���ς�
						break ;}//����ȊO�̃G���A�̏���
					break; }//����ȊO�̃G���A
				break ;}//��D�E���́E�x�z�G���A
		}//�G���A���̏���
	}//�t�F�C�Y���̏���
	if(!disp_array.length){ act.classList.add('d_none'); }//�\������v�f������Ε\��
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
			}//�\������
		}//�s���I������\���Ȃ���e����\���̂܂�
	}//�����𖞂����I�����̂ݕ\��

	act.style.left = event.pageX + DiffPageX; act.style.top = event.pageY + DiffPageY;//�\�����W�̏C��
	obj.classList.add('selected');
	var ele = document.getElementsByClassName('selected') ;
	for(i=ele.length-1;i>=0;i-=1){
		if(obj != ele[i]){ ele[i].classList.remove('selected'); }
	}

	event.stopPropagation(); return false ;
}//��ʃN���b�N���̏���
function arrowL(event,obj){
	ele = obj.parentNode.getElementsByClassName("g_top");

	if(ele[0].nextElementSibling.tagName != 'SPAN'){
		ele[0].nextElementSibling.classList.add('g_top');
		ele[0].classList.remove('g_top');
	}//�Ōザ��Ȃ�
	event.stopPropagation(); return false ;
}//����
function arrowR(event,obj){
	ele = obj.parentNode.getElementsByClassName("g_top");
	if(ele[0].previousElementSibling){
		ele[0].previousElementSibling.classList.add('g_top');
		ele[1].classList.remove('g_top');
	}//�ŏ�����Ȃ�
	event.stopPropagation(); return false ;
}//�O��
function g_start(){
	var n = deck2.length, i;
	for(i=2;i>0;i-=1){
		while (n) {
			i = Math.floor(Math.random() * n--);
			var t = deck2[n]; deck2[n] = deck2[i]; deck2[i] = t;
		}//�f�b�L�V���b�t��
		}//2�񂮂炢
	if(window.chrome){DiffPageY = -35 ;} //�u���E�U�Ή��i���̂Ƃ�Chrome�̂݁j
	//���o�C������
	if((typeof window.orientation != "undefined") || (navigator.userAgent.indexOf("Windows Phone") != -1)){document.body.style.fontSize = '200%';document.getElementById('Action').style.width='400px';}
	if(window.confirm('�\���v���C���J�n���܂����H')){
		DrawCount = 1 ;
		soloplay() ;
		window.alert('�\���v���C���J�n���܂��B'); }// �uOK�v���̏����I��
	else{ window.alert('�ʏ�ΐ�͂܂���������Ă��܂���B\n�t���[�v���C�����y���݂��������B'); }// �u�L�����Z���v���̏����I��
}//����������

function soloplay(){
	while(skill_check(game[PlayerNo-1][e_area.Territory][e_area.Force],'Aggressive')<5){
		console.log('�������͌��݁A' + skill_check(game[PlayerNo-1][e_area.Territory][e_area.Force],'Aggressive') + '��') ;
		var ele_a = card_open(game[PlayerNo-1][e_area.Deck]) ;//Play�̈悪����Ȃ̂Ő�Ɍ��J���̕\�������擾���Ă���
		var check = game[PlayerNo-1][e_area.Deck].pop() ;
		switch(check.Type){
			case e_ctype.character :{
				var Playing = {} ; Playing[ResponseCount] = check ;
				game[PlayerNo-1][e_area.Play].push(Playing);
				ResponseCount+=1 ;

				var ele_p = document.getElementById("Play_A2").firstElementChild;//Play_B�̎擾
				ele_a.firstElementChild.className = 'ch_card';
				ele_a.className = 'c_set';
				ele_a.classList.add('p' + Math.round(ResponseCount-1));
				ele_a.classList.add('g_top');
				var ele_s = ele_p.lastElementChild.previousElementSibling//arrowFL�̎擾
				ele_p.insertBefore(ele_a,ele_s);
				
				var evt = document.createEvent("MouseEvents");
				evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				response_end(evt,document.getElementById('Game')) ;
				break ; }//�L�����N�^�[�͐��̓G���A�ɃZ�b�g�����
			default :{
				game[PlayerNo-1][e_area.Discard].push(check) ;

				var ele_p = document.getElementById("Discard_A2").firstElementChild;//Play_B�̎擾
				ele_a.className = 'dis';
				ele_a.classList.add('p' + Number(game[PlayerNo-1][e_area.Discard].length ? game[PlayerNo-1][e_area.Discard].length-1 : 0));
				ele_a.classList.add('g_top');
				var ele_s = ele_p.lastElementChild.previousElementSibling//arrowFL�̎擾
				ele_p.insertBefore(ele_a,ele_s);
				if(ele_s.previousElementSibling.previousElementSibling){
					ele_s.previousElementSibling.previousElementSibling.classList.remove('g_top') ;
				}
				break; }//����ȊO�̓_���[�W�u�����
		}//�J�[�h�^�C�v���̏���
	}//������
	console.log('�������͌��݁A' + skill_check(game[PlayerNo-1][e_area.Territory][e_area.Force],'Aggressive') + '��') ;

}//�\���v���C�p����������
