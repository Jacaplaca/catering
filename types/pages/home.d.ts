export interface HomeCustomPageInterface {
    title: string;
    draft: boolean;
    key: string;
    menu: string;
    main_title: string;
    app_title: string;
    app_description: string;
    how_it_works_title: string;
    how_it_works_description: string[];
    fetch_data_title: string;
    fetch_data_description: string[];
    fetch_data_image: string;
    check_and_improve_title: string;
    check_and_improve_description: string[];
    url_title_description_length_title: string;
    url_title_description_length_description: string[];
    url_title_description_length_image: string;
    url_title_description_length_description2: string[];
    keywords_title: string;
    keywords_description: string[];
    keywords_image: string;
    keywords_info: {
        title: string;
        description: string[];
    };
    why_title_important: {
        title: string;
        description: string[];
        list: string[];
        description2: string[];
    };
    url_meaning: {
        title: string;
        description: string[];
        info: string;
    };
    rich_snippet: {
        title: string;
        description: string[];
    };
}

