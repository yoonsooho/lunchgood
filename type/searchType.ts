export interface PlacesSearchResultItem {
    /**
     * 장소 ID
     */
    id: string;

    /**
     * 장소명, 업체명
     */
    place_name: string;

    /**
     * 카테고리 이름
     * 예) 음식점 > 치킨
     */
    category_name: string;

    /**
     * 중요 카테고리만 그룹핑한 카테고리 그룹 코드
     * 예) FD6
     */
    // category_group_code?: `${CategoryCode}` | `${Exclude<CategoryCode, "">}`[];

    /**
     * 중요 카테고리만 그룹핑한 카테고리 그룹명
     * 예) 음식점
     */
    category_group_name: string;

    /**
     * 전화번호
     */
    phone: string;

    /**
     * 전체 지번 주소
     */
    address_name: string;

    /**
     * 전체 도로명 주소
     */
    road_address_name: string;

    /**
     * X 좌표값 혹은 longitude
     */
    x: string;

    /**
     * Y 좌표값 혹은 latitude
     */
    y: string;

    /**
     * 장소 상세페이지 URL
     */
    place_url: string;

    /**
     * 중심좌표까지의 거리(x,y 파라미터를 준 경우에만 존재). 단위 meter
     */
    distance: string;
}
