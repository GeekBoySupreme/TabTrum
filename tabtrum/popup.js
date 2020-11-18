//Comparer Function
function GetSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
}

document.addEventListener(
  "click",
  function (event) {
    if (event.target.id == "snapshot_button") return;

    var snapshot_index = event.target.id.split("_")[3];
    var action = event.target.id.split("_")[1];

    if (action == "delete") clickDelete(snapshot_index);
    else if (action == "launch") clickLaunch(snapshot_index);
    else if (action == "edit") clickEdit(snapshot_index);
    else if (action == "back") getBackHome();
    else return;
  },
  false
);

var button = document.getElementById("snapshot_button");
button.onclick = function () {
  try {
    chrome.storage.local.get(["data"], function (items) {
      var tab_data = items.data;

      if (tab_data) {
        chrome.tabs.query(
          { windowId: chrome.windows.WINDOW_ID_CURRENT },
          (tabs) => {
            var new_snapshot = {
              title: getaname(tab_data.length),
              id: "id_" + tab_data.length,
              tablist: tabs,
            };

            tab_data.push(new_snapshot);
            setData(tab_data);
            update_panel(new_snapshot);
          }
        );
      } else {
        var init_data = [];
        chrome.tabs.query(
          { windowId: chrome.windows.WINDOW_ID_CURRENT },
          (tabs) => {
            var new_snapshot = {
              title: getaname(init_data.length),
              id: "id_" + init_data.length,
              tablist: tabs,
            };

            init_data.push(new_snapshot);
            setData(init_data);
            update_panel(new_snapshot);
          }
        );
      }
    });
  } catch (e) {
    var init_data = [];
    chrome.tabs.query(
      { windowId: chrome.windows.WINDOW_ID_CURRENT },
      (tabs) => {
        var new_snapshot = {
          title: getaname(init_data.length),
          id: "id_" + init_data.length,
          tablist: tabs,
        };

        init_data.push(new_snapshot);
        setData(init_data);
        update_panel(new_snapshot);
      }
    );
  }
};

function loadData() {
  var render_home = "";

  try {
    chrome.storage.local.get(["data"], function (items) {
      var render_data = items.data;

      if (render_data) {
        for (var i = 0; i < render_data.length; i++) {
          render_home +=
            '<div class="snapshot_tab snapshot_tab_style_' +
            render_data[i].id +
            '" id="snapshot_tab_' +
            render_data[i].id +
            '"> \
                            <div class="snapshot_tab_container">\
                            <h5 class="snapshot_title"><span class="snapshot_marker snapshot_marker_' +
            render_data[i].id +
            '"></span>' +
            render_data[i].title +
            '</h5> \
                            <button class="snapshot_delete" id="snapshot_delete_' +
            render_data[i].id +
            '">+</button> \
                            <button class="snapshot_launch" id="snapshot_launch_' +
            render_data[i].id +
            '">Launch Tabs</button> \
                            <button class="snapshot_edit" id="snapshot_edit_' +
            render_data[i].id +
            '">Edit</button> \
                            </div></div>';
        }

        if (render_data.length == 0) {
          render_home =
            '<img id="image_holder" class="img-fluid" src="./images/miroodle.png"/> \
            <span class="placeholder_text"><b>Take your first Snapshot</b><br/>To save a list of all your open tabs</span>';

          document.getElementById("snapshot_list").innerHTML = render_home;
        } else {
          document.getElementById("snapshot_list").innerHTML = render_home;
        }
      } else {
        var data_initialize = [];
        setData(data_initialize);
      }
    });
  } catch (e) {
    console.log("Error : " + e);

    var data_initialize = [];
    setData(data_initialize);
  }
}

function setData(data_update) {
  chrome.storage.local.set({ data: data_update }, function () {
    console.log("Settings saved");
  });
}

function update_panel(data_snapshot) {
  var render_update = "";
  render_update =
    '<div class="snapshot_tab snapshot_tab_swoop_in" id="snapshot_tab_update_' +
    tracker +
    '"> \
                       <div class="snapshot_tab_container">\
                       <h5 class="snapshot_title">' +
    data_snapshot.title +
    '</h5> \
                       <button class="snapshot_delete" id="snapshot_delete_' +
    data_snapshot.id +
    '">+</button> \
                       <button class="snapshot_launch" id="snapshot_launch_' +
    data_snapshot.id +
    '">Launch Tabs</button> \
                       <button class="snapshot_edit" id="snapshot_edit_' +
    data_snapshot.id +
    '">Edit</button> \
                       </div></div>';

  chrome.storage.local.get(["data"], function (items) {
    var render_data = items.data;
    if (render_data.length > 1) {
      document.getElementById("snapshot_list").innerHTML += render_update;
      stripAnimation();
    } else {
      document.getElementById("snapshot_list").innerHTML = render_update;
      stripAnimation();
    }
  });
}

function stripAnimation() {
  try {
    setTimeout(function () {
      document.getElementById(
        "snapshot_tab_update_" + tracker
      ).className = document
        .getElementById("snapshot_tab_update_" + tracker)
        .className.replace(" snapshot_tab_swoop_in", "");
      tracker++;
    }, 101);
  } catch (e) {
    setTimeout(function () {
      document.getElementById(
        "snapshot_tab_update_" + tracker
      ).className = document
        .getElementById("snapshot_tab_update_" + tracker)
        .className.replace(" snapshot_tab_swoop_in", "");
      tracker++;
    }, 11);
  }
}

function clickLaunch(snapshot_index) {
  var index = snapshot_index;

  try {
    chrome.storage.local.get(["data"], function (items) {
      //document.write(items.data[index]);
      tabs_to_launch = items.data[index].tablist;

      for (var i = 0; i < tabs_to_launch.length; i++) {
        var launch_url = tabs_to_launch[i].url;
        console.log(launch_url);
        chrome.tabs.create({ url: launch_url });
      }
    });
  } catch (e) {
    chrome.storage.local.get(["data"], function (items) {
      tabs_to_launch = items.data[index].tablist;

      for (var i = 0; i < tabs_to_launch.length; i++) {
        var launch_url = tabs_to_launch[i].url;
        chrome.tabs.create({ url: launch_url });
      }
    });
  }
}

function clickDelete(snapshot_delete) {
  chrome.storage.local.get(["data"], function (items) {
    var index = snapshot_delete;

    if ((items.data[index].id = index)) items.data.splice(index, 1);

    for (var i = 0; i < items.data.length; i++) items.data[i].id = "id_" + i;

    setData(items.data);
    loadData();
  });
}

function clickEdit(snapshot_edit) {
  chrome.storage.local.get(["data"], function (items) {
    var index = snapshot_edit;

    tabs_to_expand = items.data[index];

    document.getElementById("snapshot_list").style.display = "none";
    document.getElementById("footer").style.display = "none";
    document.getElementById("snapshot_profile_edit").style.display = "block";

    var input_field = document.createElement("input");
    input_field.setAttribute("class", "tab_edit_title");
    input_field.setAttribute("value", tabs_to_expand.title);

    input_field.addEventListener("input", function () {
      var new_items = items;
      console.log(items.data[index]);
      new_items.data[index].title = input_field.value;

      setData(new_items.data);
      loadData();
    });

    var para = document.createElement("p");
    var text = document.createTextNode("☑️  changes are saved automatically.");
    para.appendChild(text);


    var tabs_list_show = items.data[index].tablist;
    var tablistshowhtml = "";

    for (var q = 0; q < tabs_list_show.length; q++) {
      tablistshowhtml += '<div class="tablist_tab_show"> \
        <a href="'+ tabs_list_show[q].url + '"> \
        <img class="favicon_image" src="' + tabs_list_show[q].favIconUrl + '"/> \
        <span class="tab_title">' + (tabs_list_show[q].title).substring(0, 30) + '</span> \
        </a>'
    }


    var back_button = document.createElement("button");
    back_button.setAttribute("class", "snapshot_edit name_edit");
    back_button.setAttribute("id", "snapshot_back_10");
    var text = document.createTextNode("back 😶");
    back_button.appendChild(text);

    // back_button.onclick = function () {
    //   document.getElementById("snapshot_profile_edit").innerHTML = "";
    //   document.getElementById("snapshot_profile_edit").style.display = "none";
    //   document.getElementById("snapshot_list").style.display = "block";
    //   document.getElementById("footer").style.display = "block";
    // };

    document.getElementById("snapshot_profile_edit").appendChild(back_button);
    document.getElementById("snapshot_profile_edit").appendChild(input_field);
    document.getElementById("snapshot_profile_edit").appendChild(para);
    document.getElementById("snapshot_profile_edit").innerHTML += tablistshowhtml;
  });
}

function getaname(index) {
  if (index == 0) index = Math.floor(Math.random() * 10) + 1;

  index = Math.floor(Math.random() * 20) + 1;
  var index_1 = Math.floor(Math.random() * index) + 1;

  var name_array = [
    "Natty",
    "Healthy",
    "Laughing",
    "Finding",
    "Falling",
    "Fishy",
    "Happy",
    "Jumping",
    "Sleeping",
    "Rolling",
    "Flying",
    "Hungover",
    "Humorous",
    "Cranky",
    "Corny",
    "Cheesy",
    "Thundering",
    "Grinning",
    "Saving Private",
    "Tabslayer",
    "Smiling",
  ];
  var name_array_next = [
    "Whale 🐋",
    "Sloth 🐨",
    "Bear 🐻",
    "Fish 🐠",
    "Panda 🐼",
    "Gorilla 🦍",
    "Koala 🐨",
    "Pigeon 🕊️",
    "Bunny 🐰",
    "Eagle 🦅",
    "Lion 🦁",
    "Elephant 🐘",
    "Kite 🦅",
    "Starfish 🌟",
    "Octopus 🐙",
    "Rooster 🐓",
    "Typhoon 🌪️",
    "Barnacles 👾",
    "Ant 🐜",
    "Kitten 😸",
    "Bug 🐞",
  ];
  var name = name_array[index] + " " + name_array_next[index_1];

  return name;
}

loadData();
var tracker = 0;


function getBackHome() {
  document.getElementById("snapshot_profile_edit").innerHTML = "";
  document.getElementById("snapshot_profile_edit").style.display = "none";
  document.getElementById("snapshot_list").style.display = "flex";
  document.getElementById("footer").style.display = "block";
}