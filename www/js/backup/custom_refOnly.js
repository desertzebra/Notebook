
var time = 0;

function temp_show(noticeType, text) {

	if (noticeType == "info") {
		$("notice-info").html(text);
		$("#notice-info").show();
		time = setTimeout(function() {
			$("notice-info").hide();
		}, 2000);
	} else if (noticeType == "error") {
		$("notice-error").html(text);
		$("#notice-error").show();
		time = setTimeout(function() {
			$("notice-error").hide();
		}, 2000);
	} else if (noticeType == "success") {
		$("notice-success").html(text);
		$("#notice-success").show();
		time = setTimeout(function() {
			$("notice-success").hide();
		}, 2000);
	} else if (noticeType == "warning") {
		$("notice-warning").html(text);
		$("#notice-warning").show();
		time = setTimeout(function() {
			$("notice-warning").hide();
		}, 2000);
	}
}


function convertJsonToTestimonial(data, item_id) {
	var retHtml = "";
	// Show previous testimonials
	$.each(data, function(index, element) {
		// $.each(element, function(key, value) {

		// if(key=="Agent"){
		var json_data = jQuery.parseJSON(element['Agent']);
		console.log(json_data.id);
		retHtml += "<div id='testimonial_" + element['testimonial_id']
				+ "' class='testimonial'>";
		retHtml += "<div id='agent_" + element['testimonial_id'] + "_"
				+ json_data.id + "' class='testimonial_agent'></div>"
				+ "<div class='testimonial_text'>" + element['text'] + "</div>"
				+ "<div class='testimonial_doc'>" + element['document_id']
				+ "</div>" + "" + " </div>";

		getAgent(json_data.id, "agent_" + element['testimonial_id'] + "_"
				+ json_data.id + "");
		// }
		/*
		 * retHtml += '<div id="' + key + '" class="result_item_value">' +
		 * value + '</div>';
		 */
		// });
	});

	// show comment box for new testimonials
	retHtml += "<div id='new_testimonial_" + item_id
			+ "' class='new_testimonial'>";

	retHtml += "</div>";

	$
			.getJSON(
					CONTEXT_ROOT + "/agent/isactive",
					function(json) {
						var agent = json[0];
						if (typeof agent == 'undefined') {

							$("#new_testimonial_" + item_id).html(
									"Not Logged In.");

							/*
							 * $('#user_text').disabled="disabled";
							 * $('#add_testimonial').disabled="disabled";
							 * $('#agent_'+item_id).html("Not Logged In.");
							 */
						} else {

							$("#new_testimonial_" + item_id)
									.html(
											function() {
												var retHtml = "<div id='agent_"
														+ item_id
														+ "' class='testimonial_agent'>"
														+ jsonToAgentHtml(agent)
														+ "</div>";
												retHtml += "<div id='text' class='testimonial_text'>"
														+ "<textarea name='user_text' id='user_text'>";
												retHtml += "</textarea>"
														+ "</div>";
												retHtml += "<div id='testimonial_doc'><div id='logo_uploading'></div>"
														+ "<input id='doc' type='text' readonly='true' />"
														+ " <input name='file' type='file' id='file' /></div>";
												retHtml += "<a name='add_testimonial' id='add_testimonial' class='button'"
														+ "onclick=\"add_testimonial('"
														+ item_id
														+ "','"
														+ item_id
														+ "','"
														+ agent['id']
														+ "')\">Save</a>";
												return retHtml;
											});

						}

					});

	return retHtml;
}
function getTestimonials(item_id, type) {
	$.ajax({
		url : CONTEXT_ROOT + "/testimonials/get/" + item_id + "/" + type + "",
		type : "GET",
		dataType : "html",
		success : function(data) {
			var json_data = jQuery.parseJSON(data);
			// alert(json_data.error);
			if (json_data.error != null && json_data.error.length > 0) {
				temp_show('error', json_data.error);
			}
			$('#testimonials_' + item_id).html(function() {
				return convertJsonToTestimonial(json_data, item_id);
			});
		},
		fail : function() {
			temp_show('error', 'Unable to Load Agent.');
		}
	});
}
function searchAgent(form_id) {
	$.ajax({
		url : CONTEXT_ROOT + "/agent/json",
		type : "POST",
		dataType : "html",
		data : $("#" + form_id + "_form").serialize(),
		success : function(data) {
			var json_data = jQuery.parseJSON(data);
			// alert(json_data.error);
			if (json_data.error != null && json_data.error.length > 0) {

				temp_show('error', json_data.error);
			}
			$('#' + form_id + '_result').html(function() {
				return jsonToHtml(json_data, form_id, "Agent");
			});
		},
		fail : function() {
			temp_show('error', 'Unable to Load Agent.');
		}
	});
}

function searchTransaction(id) {
	isloading(true);
	$.ajax({
		url : CONTEXT_ROOT + "/transaction/get/json",
		type : "POST",
		dataType : "html",
		data : $("#" + id + "_Tform").serialize(),
		success : function(data) {

			var json_data = jQuery.parseJSON(data);
			// alert(json_data.error);
			if (json_data.error != null && json_data.error.length > 0) {

				temp_show('error', json_data.error);
			}
			console.log(json_data);
			$('#' + id + '_Tresult').html(function() {
				return jsonToHtml(json_data, id, "Transaction");
			});
			isloading(false);
		},
		fail : function() {
			temp_show('error', 'Unable to Load Agent.');
			isloading(false);
		}
	});
}

function addTransaction() {
	isloading(true);
	$.ajax({
		url : CONTEXT_ROOT + "/transaction/add",
		type : "POST",
		dataType : "html",
		data : $("#transactionBound").serialize(),
		success : function(data) {

			var json_data = jQuery.parseJSON(data);
			// alert(json_data.error);
			if (json_data.error != null && json_data.error.length > 0) {
				temp_show('error', json_data.error);
			}
			if (json_data.success != null && json_data.success.length > 0) {

				temp_show('success', json_data.success);
			}
			isloading(false);
		},
		fail : function() {
			temp_show('error', 'Call to add new Transaction failed.');
			isloading(false);
		}
	});
}
function getAgent(agentId, div_id) {
	$.ajax({
		url : CONTEXT_ROOT + "/agent/get/" + agentId + "",
		type : "GET",
		dataType : "html",
		success : function(data) {
			var json_data = jQuery.parseJSON(data);
			// alert(json_data.error);
			if (json_data.error != null && json_data.error.length > 0) {
				temp_show('error', json_data.error);
			}
			$('#' + div_id).html(function() {
				return jsonToAgentHtml(json_data[0]);
			});
		},
		fail : function() {
			temp_show('error', 'Unable to Load Agent.');
		}
	});
}
function addAgent() {
	$.ajax({
		url : CONTEXT_ROOT + "/agent/add",
		type : "POST",
		dataType : "html",
		data : $("#agentBound").serialize(),
		success : function(data) {
			console.log(data);
			var json_data = jQuery.parseJSON(data);
			// alert(json_data.error);
			if (json_data.error != null && json_data.error.length > 0) {
				temp_show('error', json_data.error);
			}
			if (json_data.success != null && json_data.success.length > 0) {
				temp_show('success', json_data.success);
			}
		},
		fail : function() {
			temp_show('error', 'Call to add new Agent failed.');
		}
	});
}
function updateAgent() {
	$.ajax({
		url : CONTEXT_ROOT + "/agent/update",
		type : "POST",
		dataType : "html",
		data : $("#agentBound").serialize(),
		success : function(data) {
			console.log(data);
			var json_data = jQuery.parseJSON(data);
			// alert(json_data.error);
			if (json_data.error != null && json_data.error.length > 0) {
				temp_show('error', json_data.error);
			}
			if (json_data.success != null && json_data.success.length > 0) {
				temp_show('success', json_data.success);
			}
		},
		fail : function() {
			temp_show('error', 'Call to add new Agent failed.');
		}
	});
}
function setLinked_TransactionFormValues(field_name, el_id) {

	element = $('#transaction_item_' + el_id).find('#transactionId')[0];

	var value;
	if ('textContent' in element) {
		value = element.textContent;
	} else {
		value = element.innerText;
	}

	$("#" + field_name).val(value);

}

function linkedTransactions(donorId) {
	isloading(true);
	$.ajax({
		url : CONTEXT_ROOT + "/transaction/get/json",
		type : "POST",
		dataType : "html",
		data : "recv=" + donorId,
		success : function(data) {

			var json_data = jQuery.parseJSON(data);
			// alert(json_data.error);
			if (json_data.error != null && json_data.error.length > 0) {
				temp_show('error', json_data.error);
			}
			$('div#linked_transactions_result').html(function() {
				var json_r = jsonToHtml(json_data, "parentId", "Transaction");
				// alert(json_r);
				return json_r;
			});
			isloading(false);
		},
		fail : function() {
			temp_show('error', 'Unable to load search form.');
			isloading(false);
		}
	});
}

function getMenuItem(menu_url, func_name) {
	$.ajax({
		url : CONTEXT_ROOT + menu_url,
		type : "GET",
		dataType : "html",
		cache : false,
		beforeSend : function() {
			// $('#main').hide(2000);
			isloading(true);
		},
		success : function(data) {

			var xmlDoc = $.parseXML(data);
			$xml = $(xmlDoc);
			console.log($xml);
			$("#main").replaceWith($xml.find('#main'));
			if (typeof func_name != 'undefined' && func_name != "") {

				var arg = $('input#TransactionId').val();
				// console.log(arg);
				/*
				 * if(typeof arg == 'undefined'){ $("#main").replaceWith($xml); }
				 */
				callFunc(func_name, arg);

			}

			// $('#main').html(value);
			// $('#main').show(2000);
			isloading(false);

		},
		fail : function() {
			temp_show('error', 'Unable to Load Profile.');
			// $('#main').show(2000);
			isloading(false);
		}
	});
}
function callFunc(func_name, arg) {
	if (typeof func_name == 'undefined') {
		return;
	} else if (func_name == 'analyse_details') {
		analyseTransactions(arg, 'details');
	} else if (func_name == 'analyse') {
		analyseTransactions(arg);
	} else {
		console.log(func_name + " not recognised");
		return;
	}
}
function isloading(state) {
	if (state) {
		$('#overlay').show();
	} else {
		$('#overlay').hide();
	}

}
function logout() {
	isloading(true);
	$.ajax({
		url : CONTEXT_ROOT + "/j_spring_security_logout",
		type : "GET",
		success : function(data) {
			initLogin();
			isloading(false);
		},
		fail : function() {
			temp_show('error', 'Unable to logout. Please try again. ');
			isloading(false);
		}
	});

}

function login() {
	isloading(true);
	$.ajax({
		url : CONTEXT_ROOT + "/j_spring_security_check",
		type : "POST",
		dataType : "html",
		data : $("#block_login").serialize(),
		success : function(data) {

			var json_data = jQuery.parseJSON(data);
			// alert(json_data.error);
			if (json_data.error != null && json_data.error.length > 0) {

				temp_show('error', json_data.error);
			} else {
				initLogin();
			}
			isloading(false);
			// $('#login').html(json);
		},
		fail : function() {
			temp_show('error', 'Call to Authenticate, failed.');
			isloading(false);
		}
	});

}

function initLogin() {
	isloading(true);
	$
			.getJSON(
					CONTEXT_ROOT + "/agent/isactive",
					function(json) {
						if (typeof (json) != 'undefined' && json.length > 0) {
							console.log(json);
							var loggedInUser = json[0];
							$('#login')
									.html(
											"<div class='block_head'>Profile</div> "
													+ "<div class='block_options'>"
													+ "<ul>"
													+ '<div>'
													+ '<li><a class="button" onclick="getMenuItem(\'/agent/details/\',\'\')">'
													+ 'Details</a>'
													+ '</li>'
													+ "<li><a onclick='logout()' class='button'>"
													+ "Logout</a></li>"
													+ "</ul>"
													+ "</div>"
													+ jsonToAgentHtml(loggedInUser));

						} else {
							$('#login')
									.html(
											function() {
												return "<div class='block_head'>Login</div>"
														+ " <div class='login_form'>"
														+ "<form name='block_login' id='block_login'  prependId = 'false' method=\"POST\">"
														+ "<div class='form_item'>"
														+ "<label for='j_username'>Email:</label>"
														+ "<input type='text' name='j_username' id='j_username' />"
														+ "</div>"
														+ "<div class='form_item'>"
														+ "<label for='j_password'>Password:</label>"
														+ "<input type='password' name='j_password' id='j_password' />"
														+ "</div>"
														+ "<div class='form_item'>"
														+ "<a name='login_btn' id='login_btn' class='button'"
														+ "onclick=\"login()\">Enter</a>"
														+ "</div>"
														+ "</form></div>";
											});
						}
						isloading(false);

					});
}
// $('#field1').linkField('#field2');
// http://forum.jquery.com/topic/linking-two-form-fields
(function($) {

	initLogin();

	$.fn.linkField = function(field_id) {
		var self = this, field = $(field_id);
		field.bind('keyup.linked,blur.linked', function() {
			self.val(field.val());
		});
		return this.bind('keyup.linked,blur.linked', function() {
			field.val(self.val());
		});
	};
	$.fn.unlinkField = function() {
		field.unbind('.linked');
		return this.unbind('.linked');
	};

	$(document).on('change', 'input#donor', function() {
		alert($(this).val());
		linkedTransactions($(this).val());
	});
	$(document).on('change', '#file', function() {

		var fileInput = document.getElementById('file');
		var file = fileInput.files[0];
		var formData = new FormData();
		formData.append('file', file);
		if ($('#name').val() != "") {
			formData.append('name', $('#name').val());
		}
		setOperation('#logo_uploading', 'loading');
		$.ajax({
			url : CONTEXT_ROOT + "/docs/fileupload",
			data : formData,
			cache : false,
			contentType : false,
			processData : false,
			type : 'POST',
			success : function(response) {
				// document.getElementById('logo').innerHTML = response;
				var json_data = jQuery.parseJSON(response);
				// alert(json_data.error);
				if (json_data.error != null && json_data.error.length > 0) {

					temp_show('error', json_data.error);
					setOperation('#logo_uploading', 'error');
				} else {
					$('input#logo').val(json_data.doc_id);
					$('input#doc').val(json_data.doc_id);
					setOperation('#logo_uploading', 'success');

				}
				// $('#logo_uploading').hide();

			},
			fail : function() {
				temp_show('error', 'Unable to save document. Try again!!');
				setOperation('#logo_uploading', 'error');
				// $('#main').show(2000);

			}

		});
	});

})(jQuery);
function setOperation(div, state) {
	if (state == "loading") {
		$(div).addClass('loading');
		$(div).removeClass('error');
		$(div).removeClass('success');
	} else if (state == "error") {
		$(div).removeClass('loading');
		$(div).addClass('error');
		$(div).removeClass('success');
	} else if (state == "success") {
		$(div).removeClass('loading');
		$(div).removeClass('error');
		$(div).addClass('success');
	}
}
