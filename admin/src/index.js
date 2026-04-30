import pluginId from "./pluginId";
import { getTranslation } from './utils/getTranslation';

export default {
  register(app) {
    app.customFields.register({
      name: "tags",
      pluginId: pluginId,
      type: "string",
      intlLabel: {
        id: getTranslation('form.label'),
        defaultMessage: 'TagsInput',
      },
      intlDescription: {
        id: getTranslation('form.description'),
        defaultMessage: 'TagsInput to add custom tags',
      },
      components: {
        Input: async () =>
          import(
            /* webpackChunkName: "input-component" */ "./components/Input"
          ),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: "form.section.apiUrl",
              defaultMessage: "API Url",
            },
            items: [
              {
                intlLabel: {
                  id: "form.apiUrl",
                  defaultMessage: "Rest API URL for suggestions",
                },
                name: "options.apiUrl",
                type: "text",
                value: "",
                options: [],
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: "global.settings",
              defaultMessage: "Settings",
            },
            items: [
              {
                name: "required",
                type: "checkbox",
                intlLabel: {
                  id: "form.attribute.item.requiredField",
                  defaultMessage: "Required field",
                },
                description: {
                  id: "form.attribute.item.requiredField.description",
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });
  },
};
