import { Component, OnInit, OnDestroy } from "@angular/core";

import { MissionService } from "../mission.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

// import Inputmask from "inputmask";
// import * as widgets from 'surveyjs-widgets';
// Import Survey.js
import * as Survey from "survey-angular";
// import { addQuestionTypes } from '../survey/question-types';
// widgets.inputmask(Survey);
@Component({
  selector: "app-hrt-complaint-file-in-time-page",
  templateUrl: "./hrt-complaint-file-in-time-page.component.html",
  styleUrls: ["./hrt-complaint-file-in-time-page.component.scss"],
})
export class HrtComplaintFileInTimePageComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  private json = {
    showNavigationButtons: false,
    completeText: "",
    showQuestionNumbers: "off",

    pages: [
      {
        name: "Is the Complaint filed in Time?",
        // title: "Is the Complaint filed in Time? ",
        elements: [
          {
            type: "html",
            name: "question2",
            html:
              "<h4>There is a 1-year time limit for filing a complaint</h4>\n<p>Please provide all dates in the following format: YYYY MM DD. If the date of the event of discrimination was February 3rd, 2020, you would write 2020-02-03<p>\n<p style='margin-bottom: -15px;'><b>For each Respondent, what is the date of the most recent conduct that you say is discrimination?</b></p>",
          },
          {
            type: "paneldynamic",
            name: "There is a one-year time limit for filing a complaint",
            titleLocation: "hidden",
            description: "For each Respondent",
            isRequired: true,
            "panelAddText": "Add Respondent",
            "panelRemoveText": "Remove Respondent",
            templateElements: [
              {
                titleLocation: "top",
                type: "text",
                name: "Respondent name",
              },
              {
                titleLocation: "top",
                type: "text",
                name:
                  "What is the date of the most recent event that you say is discrimination?",
                isRequired: true,
                inputType: "date",
              },
              {
                titleLocation: "top",
                type: "radiogroup",
                name: "Did the most recent conduct happen in the last year?",
                isRequired: true,
                choices: ["Yes", "No"],
              },
            ],
            panelCount: 1,
            minPanelCount: 1,
          },
          {
            type: "radiogroup",
            name:
              "Did all of the conduct happen in the last year for all Respondents?",
            isRequired: true,
            choices: ["Yes", "No"],
          },
          {
            type: "radiogroup",
            name: "Is all of the conduct related or similar?",
            visibleIf:
              "{Did all of the conduct happen in the last year for all Respondents?} = 'No'",
            isRequired: true,
            popupdescription: `<p>You must file a complaint within one year of the last conduct if the conduct is similar or related. The legal term is “continuing contravention”. </p>`,
            choices: ["Yes", "No"],
          },
          {
            type: "comment",
            name: "Explain how the conduct is similar or related",
            popupdescription: `<div class="section"> <p> <b>Examples.</b> </p> <ul> <li>Each event is about a co-worker using racial slurs. </li> <li>Each event is about an employer not accommodating a disability.</li> </ul> </div>`,
            visibleIf: "{Is all of the conduct related or similar?} = 'Yes'",
            isRequired: true,
          },
          {
            type: "comment",
            name: "Explain any gaps in time",
            popupdescription: `<div class="section"> <p> Gaps in time might mean there is no “continuing contravention”. The Tribunal will consider reasons for gaps. </p> <p> <b>Examples.</b> </p> <ul> <li>“My employer denied me three promotions. The job postings were three months apart.”</li> <li>“My manager used racial slurs. He was on leave for four months.”</li> </ul> </div>`,
            visibleIf: "{Is all of the conduct related or similar?} = 'Yes'",
            isRequired: true,
          },
        ],
      },
      {
        name: "Ask Tribunal to accept late Complaint",
        title: "Ask Tribunal to Accept Late Complaint",
        elements: [
          {
            type: "html",
            name: "Information",
            html:
              "<h4>\nInformation\n</h4>\n<p>\nThere must be a good reason to accept the late complaint. The legal term is that it must be in the “public interest”.\n</p>\n<p>\nThere must be no real harm to anyone because of the delay in filing. The legal term is no “substantial prejudice”.\n</p>",
          },
          {
            type: "html",
            html:
              "<h5 class='sv_q_title'><b>Reasons to accept complaint</b></h5>",
            popupdescription:
              "<p><b>Reasons</b> to accept a late complaint include:</p><ul style='margin-bottom: 0;'><li>Why you filed late, and how late you filed</li><li>Any other reason why accepting the complaint would benefit the public </li></ul>",
          },
          {
            type: "comment",
            name: "Why did you file late?",
            isRequired: true,
            popupdescription:
              "<p><b>Examples the Tribunal will consider:</b></p><ul><li>The complainant has a disability that prevented them from filing on time. </li><li>The complainant faced trauma or a family or housing crisis that made it hard to file the complaint at the time of the events</li><li>The complainant recently found evidence of discrimination</li><li>The delay is very short and there is some reason for filing late</li></ul><p>You can submit any documents that support your reasons for filing your complaint late</p>",
          },
          {
            type: "comment",
            name: "How will accepting your complaint benefit the public?",
            isRequired: true,
            popupdescription:
              "<p><b>Example:</b></p><ul><li>A complaint is about a situation that the Tribunal has not addressed often</li><li>A complaint seeks a remedy that would help many people. </li></ul> ",
          },
          {
            type: "comment",
            name: "Why would the delay in filing not harm anyone else?",
            isRequired: true,
            popupdescription:
              "<p><b>Information:</b> The delay means the time after the 1-year time limit.</p><ul><li>“The complaint is two months late. Documents and witnesses should still be available.” </li><li>“The complaint is six months late. I know of no harm to the Respondents.”</li></ul>",
          },
        ],
        visibleIf:
          "{Did all of the conduct happen in the last year for all Respondents?} = 'No'",
      },
    ],
  };
  closed = true;
  survey: any;
  formData: object;
  constructor(private missionService: MissionService, private router: Router) {
    this.subscription = missionService.missionAnnounced$.subscribe(
      (allFormData) => {
        console.log("allFormData", allFormData);

        if (allFormData.fileInTime) {
          this.formData = allFormData.fileInTime;
          console.log("hi!");
        }
        this.subscription.unsubscribe();
      }
    );
  }
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    // console.log("Survey.Survey.cssType", Survey.Survey.cssType);
    // this.initSurvey();
    //Add a property a text property into all questions types and into page
    Survey.JsonObject.metaData.addProperty("question", "popupdescription:text");
    Survey.JsonObject.metaData.addProperty("page", "popupdescription:text");

    this.renderSurvey();
  }

  showDescription(element) {
    document.querySelector(".popup-body").innerHTML = element.popupdescription;
    // $("#questionDescriptionPopup").modal();
    this.toggleModal();
  }
  toggleModal() {
    console.log(123123123);
    this.closed = !this.closed;
  }
  renderSurvey() {
    console.log("hi!1");
    // let surveyModel =
    this.survey = new Survey.Model(this.json);
    if (this.formData) {
      console.log("hi122!");
      this.survey.data = this.formData;
    }
    this.survey.onAfterRenderQuestion.add((survey, options) => {
      console.log("+++++++");
      console.log(options);

      //Return if there is no description to show in popup
      if (!options.question.popupdescription) return;
      console.log("has desc");
      //Add a button;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-default btn-xs";

      // btn.style.position = "absolute";
      btn.style.marginLeft = "10px";

      btn.innerHTML = "More Info";
      var question = options.question;
      btn.onclick = () => {
        this.showDescription(question);
      };
      var header = options.htmlElement.querySelector("h5");
      var span = document.createElement("span");
      span.innerHTML = "  ";
      header.appendChild(span);
      header.appendChild(btn);
    });
    console.log("hi!2");
    Survey.SurveyNG.render("surveyElementHRT", { model: this.survey });
    console.log("hi!3");
  }
  handleNextStep() {
    if (this.survey.isLastPage) {
      const validated = this.survey.completeLastPage();
      if (validated) {
        this.missionService.confirmMission({
          name: "fileInTime",
          data: this.survey.data,
          complete: true,
        });
        this.router.navigateByUrl("hrt/progress");
      }
    } else {
      this.survey.nextPage();
    }
  }
}
